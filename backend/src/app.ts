import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay"


import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

// Create an instance of Express
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Initialize Razorpay instance
export const instance = new Razorpay({
    key_id: process.env.KEY_ID as string, // Type assertion
    key_secret: process.env.KEY_SECRET as string // Type assertion
});

// Import and use routes
import studentRouter from "./routes/student.routes.js";
app.use("/api/student", studentRouter);

import teacherRouter from "./routes/teacher.routes.js";
app.use("/api/teacher", teacherRouter);

import courseRouter from "./routes/course.routes.js";
app.use("/api/course", courseRouter);

import adminRouter from "./routes/admin.routes.js";
app.use("/api/admin", adminRouter);

import paymentRouter from "./routes/payment.routes.js";
app.use("/api/payment", paymentRouter);

// Export the app
export { app };