import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export const instance = new Razorpay({
    key_id: process.env.KEY_ID as string, // Type assertion to ensure it's a string
    key_secret: process.env.KEY_SECRET as string // Type assertion to ensure it's a string
});

// Student routes
import studentRouter from "./routes/student.routes";
app.use("/api/student", studentRouter);

// Teacher routes
import teacherRouter from "./routes/teacher.routes";
app.use("/api/teacher", teacherRouter);

// Course routes
import courseRouter from "./routes/course.routes";
app.use("/api/course", courseRouter);

// Admin routes
import adminRouter from "./routes/admin.routes";
app.use("/api/admin", adminRouter);

// Payment routes
import paymentRouter from "./routes/payment.routes";
app.use("/api/payment", paymentRouter);

export { app };