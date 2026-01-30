import AppError from "../../core/AppError";
import { UserModel } from "../../models/User";
import { AuthUser } from "../../interfaces/user";
import { generateTokens } from "../../services/jwt";
import { getModelByRole } from "../../utils/getModelByRole";
import { LoginInput } from "./dto/login";
import { SignupInput } from "./dto/signup";
import bcrypt from "bcryptjs";

export default {
  // ------------------------------ signup ------------------------------
  signup: async (data: SignupInput) => {
    const existing = await UserModel.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existing) {
      throw AppError.conflict("Username or email already exists", {
        field: existing.email === data.email ? "email" : "username",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const Model = getModelByRole(data.role);
    const user = await Model.create({ ...data, password: hashedPassword });

    return { id: user._id.toString() };
  },

  // ------------------------------ login ------------------------------
  login: async (data: LoginInput) => {
    const user = await UserModel.findOne({ email: data.email }).select(
      "+password +role"
    );

    if (!user) throw AppError.unauthorized("Invalid email or password");

    if (!(await bcrypt.compare(data.password, user.password!))) {
      throw AppError.unauthorized("Invalid email or password");
    }

    const authUser: AuthUser = {
      id: user._id.toString(),
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokens(authUser);

    return {
      accessToken,
      refreshToken,
      role: user.role,
    };
  },
};
