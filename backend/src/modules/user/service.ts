import AppError from "../../core/AppError";
import { Role } from "../../interfaces/user";
import { UserModel } from "../../models/User";
import { MediaModel } from "../../models/Media";
import { AuthUser } from "../../interfaces/user";
import { getModelByRole } from "../../utils/getModelByRole";
import { normalizeMongo, normalizeMongoList } from "../../utils/mongoNormalize";
import { fetchS3Url } from "../../utils/s3UrlCache";
import { ChangePasswordInput } from "./dto/changePassword";
import { SearchUsersInput, SearchUsersResponse } from "./dto/searchUsers";
import { UpdateProfileInput } from "./dto/updateProfile";
import bcrypt from "bcryptjs";

export default {
  // ------------------------------ get profile ------------------------------
  getProfile: async (data: AuthUser) => {
    const Model = getModelByRole(data.role);
    const user = await Model.findById(data.id).select("-note").lean();
    if (!user) throw AppError.notFound("User not found");

    let avatarUrl: string | undefined;
    if (user.avatar_id) {
      const media = await MediaModel.findById(user.avatar_id);
      if (media?.file_key) {
        avatarUrl = await fetchS3Url(media.file_key);
      }
    }

    return {
      ...normalizeMongo(user),
      avatar_url: avatarUrl,
    };
  },

  // ------------------------------ update profile ------------------------------
  updateProfile: async <R extends Role>(
    user: AuthUser,
    data: UpdateProfileInput<R>
  ) => {
    const Model = getModelByRole(user.role);

    const updated = await Model.findByIdAndUpdate(
      user.id,
      { $set: data },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updated) throw AppError.notFound("User not found");

    return updated;
  },

  // ------------------------------ change password ------------------------------
  changePassword: async (id: string, data: ChangePasswordInput) => {
    const user = await UserModel.findById(id).select("+password");
    if (!user) throw AppError.notFound("User not found");

    if (!(await bcrypt.compare(data.oldPassword, user.password!))) {
      throw AppError.unauthorized("Old password is incorrect");
    }

    user.password = await bcrypt.hash(data.newPassword, 10);
    await user.save();
    return true;
  },

  // ------------------------------ get user by id ------------------------------
  getUserById: async (id: string) => {
    const user = await UserModel.findById(id).select("-password").lean();
    if (!user) throw AppError.notFound("User not found");

    let avatarUrl: string | undefined;
    if (user.avatar_id) {
      const media = await MediaModel.findById(user.avatar_id);
      if (media?.file_key) {
        avatarUrl = await fetchS3Url(media.file_key);
      }
    }

    return {
      ...normalizeMongo(user),
      avatar_url: avatarUrl,
    };
  },

  // ------------------------------ search user ------------------------------
  searchUsers: async (data: SearchUsersInput): Promise<SearchUsersResponse> => {
    const { page, limit, sortBy, order, search, role, status, japaneseLevel } =
      data;

    const mongoQuery: Record<string, any> = {};

    if (role) {
      mongoQuery.role = role;
    }

    if (role === "TEACHER" && status) {
      mongoQuery.status = status;
    }

    if (role === "STUDENT" && japaneseLevel) {
      mongoQuery.japaneseLevel = japaneseLevel;
    }

    if (search?.trim()) {
      const keyword = search.trim();
      mongoQuery.$or = [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { full_name: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find(mongoQuery)
        .select("-password")
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(mongoQuery),
    ]);

    return {
      users: normalizeMongoList(users),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
