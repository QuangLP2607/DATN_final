import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/errorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";

import authRoutes from "./modules/auth/router";
import userRoutes from "./modules/user/router";
import courseRoutes from "./modules/course/router";
import classRoutes from "./modules/class/router";
import scheduleRoutes from "./modules/schedule/router";
import sessionsRoutes from "./modules/session/router";
import enrollmentRoutes from "./modules/enrollment/router";
import statsRoutes from "./modules/stats/router";
import quizRoutes from "./modules/quiz/router";
import quizAttemptRoutes from "./modules/quizAttempt/router";
import mediaRoutes from "./modules/media/router";
import lectureRoutes from "./modules/lecture/router";
import liveRoomRoutes from "./modules/liveRoom/router";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.0.3:5173",
      "http://47.130.151.41", // FE production
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/class", classRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/live-room", liveRoomRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/lecture", lectureRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/attempt", quizAttemptRoutes);
app.use("/api/stats", statsRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
