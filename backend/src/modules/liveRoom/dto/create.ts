import { z } from "zod";
import { objectIdSchema, stringSchema } from "../../../utils/zod";

export const CreateLiveRoomSchema = z
  .object({
    room_name: stringSchema("roomName", 3, 50),
    class_id: objectIdSchema,
  })
  .strict();

export type CreateLiveRoomInput = z.infer<typeof CreateLiveRoomSchema>;
