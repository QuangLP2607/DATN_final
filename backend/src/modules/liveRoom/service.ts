import { Types } from "mongoose";
import AppError from "../../core/AppError";
import { LiveRoomModel } from "../../models/LiveRoom";
import { UserModel } from "../../models/User";
import { generateJitsiToken, JitsiUser } from "../../services/jitsi";
import { CreateLiveRoomInput } from "./dto/create";
import { redis } from "../../config/redis";

const TEACHER_TTL = 90; // seconds
const teacherKey = (roomId: string) => `live-room:${roomId}:teacher`;

export default {
  // -------------------- CREATE OR JOIN ROOM --------------------
  createRoom: async (input: CreateLiveRoomInput, userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw AppError.notFound("User not found");

    const userObjectId = new Types.ObjectId(user._id);

    let room = await LiveRoomModel.findOne({
      class_id: input.class_id,
      status: "OPEN",
    });

    if (!room) {
      room = await LiveRoomModel.create({
        name: input.room_name,
        class_id: input.class_id,
        created_by: userObjectId,
        participants: [userObjectId],
        status: "OPEN",
      });
    } else {
      if (!room.participants.some((id) => id.equals(userObjectId))) {
        room.participants.push(userObjectId);
        await room.save();
      }
    }

    if (user.role === "TEACHER") {
      await redis.setex(teacherKey(room._id.toString()), TEACHER_TTL, "online");
    }

    const jitsiUser: JitsiUser = {
      _id: user._id.toString(),
      role: user.role,
      name: user.username || "Guest",
      email: user.email,
    };

    const token = generateJitsiToken(jitsiUser, room._id.toString());

    return {
      roomId: room._id.toString(),
      token,
    };
  },

  // -------------------- JOIN ROOM --------------------
  joinRoom: async (id: string, userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw AppError.notFound("User not found");
    console.log("id", id);
    const room = await LiveRoomModel.findById(id);
    if (!room) throw AppError.notFound("Room not found");

    const userObjectId = new Types.ObjectId(user._id);

    if (!room.participants.some((id) => id.equals(userObjectId))) {
      room.participants.push(userObjectId);
      await room.save();
    }

    if (user.role === "TEACHER") {
      await redis.setex(teacherKey(room._id.toString()), TEACHER_TTL, "online");
    }

    const jitsiUser: JitsiUser = {
      _id: user._id.toString(),
      role: user.role,
      name: user.username || "Guest",
      email: user.email,
    };

    const token = generateJitsiToken(jitsiUser, room._id.toString());

    return {
      roomId: room._id.toString(),
      token,
    };
  },

  // -------------------- LEAVE ROOM --------------------
  leaveRoom: async (roomId: string, userId: string) => {
    const room = await LiveRoomModel.findById(roomId);
    if (!room) throw AppError.notFound("Room not found");

    const userObjectId = new Types.ObjectId(userId);

    room.participants = room.participants.filter(
      (id) => !id.equals(userObjectId),
    );

    if (room.created_by.equals(userObjectId)) {
      await redis.del(teacherKey(roomId));
    }

    if (room.participants.length === 0) {
      room.status = "CLOSED";
      room.ended_at = new Date();
    }

    await room.save();
  },

  // -------------------- PING ROOM (HEARTBEAT) --------------------
  pingRoom: async (roomId: string, userId: string) => {
    const room = await LiveRoomModel.findById(roomId);
    if (!room) throw AppError.notFound("Room not found");

    if (!room.created_by.equals(userId)) return;

    await redis.expire(teacherKey(roomId), TEACHER_TTL);
  },

  // -------------------- CHECK TEACHER ONLINE --------------------
  isTeacherOnline: async (roomId: string): Promise<boolean> => {
    const exists = await redis.exists(teacherKey(roomId));
    return exists === 1;
  },

  // -------------------- GET CLASS LIVE STATUS --------------------
  getClassLiveStatus: async (classId: string) => {
    const room = await LiveRoomModel.findOne({
      class_id: classId,
      status: "OPEN",
    });

    if (!room) {
      return { isLive: false };
    }

    const teacherOnline = await redis.exists(`live-room:${room._id}:teacher`);

    return {
      isLive: true,
      roomId: room._id.toString(),
      teacherOnline: teacherOnline === 1,
    };
  },
};
