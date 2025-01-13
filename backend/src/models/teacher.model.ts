import mongoose, { Document, Schema, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Define the Teacher Document Interface
interface ITeacher extends Document {
  Email: string;
  Firstname: string;
  Lastname: string;
  Password: string;
  forgetPasswordToken?: string;
  forgetPasswordExpiry?: Date;
  Isverified?: boolean;
  Isapproved?: "approved" | "rejected" | "pending" | "reupload";
  Remarks?: string;
  Refreshtoken?: string;
  Teacherdetails?: mongoose.Schema.Types.ObjectId;
  Balance?: number;
  WithdrawalHistory?: { amount: number; date: Date }[];
  enrolledStudent?: { studentId: mongoose.Schema.Types.ObjectId; isNewEnrolled: boolean }[];
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateResetToken(): Promise<void>;
}

// Define Teacher Schema
const teacherSchema = new mongoose.Schema<ITeacher>(
  {
    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    Firstname: {
      type: String,
      required: true,
      trim: true,
    },
    Lastname: {
      type: String,
      required: true,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
    },
    forgetPasswordToken: { type: String },
    forgetPasswordExpiry: { type: Date },
    Isverified: {
      type: Boolean,
      default: false,
    },
    Isapproved: {
      type: String,
      enum: ["approved", "rejected", "pending", "reupload"],
      default: "pending",
    },
    Remarks: { type: String },
    Refreshtoken: { type: String },
    Teacherdetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacherdocs",
    },
    Balance: {
      type: Number,
      default: 0,
    },
    WithdrawalHistory: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    enrolledStudent: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
        isNewEnrolled: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

// Middleware for Pre-Save Operations
teacherSchema.pre("save", async function (next) {
  if (this.isModified("Firstname") || this.isNew) {
    this.Firstname = this.Firstname.charAt(0).toUpperCase() + this.Firstname.slice(1).toLowerCase();
  }
  if (this.isModified("Lastname") || this.isNew) {
    this.Lastname = this.Lastname.charAt(0).toUpperCase() + this.Lastname.slice(1).toLowerCase();
  }
  next();
});

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcrypt.hash(this.Password, 10);
  next();
});

// Methods Implementation
teacherSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.Password);
};

teacherSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { _id: this._id, Email: this.Email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

teacherSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { _id: this._id, Email: this.Email },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

teacherSchema.methods.generateResetToken = async function (): Promise<void> {
  const reset = crypto.randomBytes(20).toString("hex");
  this.forgetPasswordToken = crypto.createHash("sha256").update(reset).digest("hex");
  this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  await this.save();
};

// Create and Export Models
const Teacher: Model<ITeacher> = mongoose.model<ITeacher>("Teacher", teacherSchema);

interface ITeacherdocs extends Document {
  Phone: number;
  Address: string;
  Experience: number;
  SecondarySchool: string;
  HigherSchool: string;
  UGcollege: string;
  PGcollege: string;
  SecondaryMarks: number;
  HigherMarks: number;
  UGmarks: number;
  PGmarks: number;
  Aadhaar: string;
  Secondary: string;
  Higher: string;
  UG: string;
  PG: string;
}

const TeacherDetailsSchema = new mongoose.Schema<ITeacherdocs>(
  {
    Phone: { type: Number, required: true, trim: true, unique: true },
    Address: { type: String, required: true },
    Experience: { type: Number, required: true },
    SecondarySchool: { type: String, required: true },
    HigherSchool: { type: String, required: true },
    UGcollege: { type: String, required: true },
    PGcollege: { type: String, required: true },
    SecondaryMarks: { type: Number, required: true },
    HigherMarks: { type: Number, required: true },
    UGmarks: { type: Number, required: true },
    PGmarks: { type: Number, required: true },
    Aadhaar: { type: String, required: true },
    Secondary: { type: String, required: true },
    Higher: { type: String, required: true },
    UG: { type: String, required: true },
    PG: { type: String, required: true },
  },
  { timestamps: true }
);

const Teacherdocs: Model<ITeacherdocs> = mongoose.model<ITeacherdocs>("Teacherdocs", TeacherDetailsSchema);

export { Teacher, Teacherdocs };
