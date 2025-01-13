import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Define the TypeScript interface for the Course document
export interface ICourse extends Document {
  coursename: string;
  description: string;
  isapproved?: boolean; // Optional, default is `false`
  liveClasses: {
    title: string;
    timing: number;
    date: Date;
    link: string;
    status: "upcoming" | "in-progress" | "completed"; // Enum values
  }[];
  enrolledteacher: Types.ObjectId; // Reference to the Teacher model
  enrolledStudent: Types.ObjectId[]; // Array of references to Student model
  schedule: {
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Enum for days of the week
    starttime: number; // Minutes since midnight
    endtime: number; // Minutes since midnight
  }[];
  createdAt?: Date; // Automatically added by `timestamps`
  updatedAt?: Date; // Automatically added by `timestamps`
}

// Define the Course schema
const courseSchema: Schema<ICourse> = new mongoose.Schema(
  {
    coursename: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isapproved: {
      type: Boolean,
      default: false,
    },
    liveClasses: [
      {
        title: { type: String, required: true },
        timing: { type: Number, required: true }, // Minutes since midnight
        date: { type: Date, required: true },
        link: { type: String, required: true },
        status: {
          type: String,
          enum: ["upcoming", "in-progress", "completed"],
          default: "upcoming",
        },
      },
    ],
    enrolledteacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: true,
    },
    enrolledStudent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      },
    ],
    schedule: [
      {
        day: {
          type: Number,
          enum: [0, 1, 2, 3, 4, 5, 6], // Days of the week
          required: true,
        },
        starttime: {
          type: Number,
          min: 0,
          max: 24 * 60,
          required: true,
        },
        endtime: {
          type: Number,
          min: 0,
          max: 24 * 60,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Define the Course model
const Course: Model<ICourse> = mongoose.model<ICourse>("course", courseSchema);

export { Course };
