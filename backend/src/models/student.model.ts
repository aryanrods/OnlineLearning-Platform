import mongoose, { Schema, Document, Model, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Define the TypeScript interface for student details
interface IStudentDetails extends Document {
  Phone: number;
  Address: string;
  Highesteducation: string;
  SecondarySchool: string;
  HigherSchool: string;
  SecondaryMarks: number;
  HigherMarks: number;
  Aadhaar: string;
  Secondary: string;
  Higher: string;
}

// Define the TypeScript interface for students
interface IStudent extends Document {
  Email: string;
  Firstname: string;
  Lastname: string;
  Password: string;
  Isverified: boolean;
  Isapproved: "approved" | "rejected" | "pending" | "reupload";
  Remarks?: string;
  Refreshtoken?: string;
  Studentdetails: Types.ObjectId | IStudentDetails;
  forgetPasswordToken?: string;
  forgetPasswordExpiry?: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  generateResetToken(): Promise<string>;
}

// Define the student details schema
const studentDetailsSchema: Schema<IStudentDetails> = new mongoose.Schema(
  {
    Phone: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    Address: {
      type: String,
      required: true,
    },
    Highesteducation: {
      type: String,
      required: true,
    },
    SecondarySchool: {
      type: String,
      required: true,
    },
    HigherSchool: {
      type: String,
      required: true,
    },
    SecondaryMarks: {
      type: Number,
      required: true,
    },
    HigherMarks: {
      type: Number,
      required: true,
    },
    Aadhaar: {
      type: String,
      required: true,
    },
    Secondary: {
      type: String,
      required: true,
    },
    Higher: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define the student schema
const studentSchema: Schema<IStudent> = new mongoose.Schema(
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
    Isverified: {
      type: Boolean,
      default: false,
    },
    Isapproved: {
      type: String,
      enum: ["approved", "rejected", "pending", "reupload"],
      default: "pending",
    },
    Remarks: {
      type: String,
    },
    Refreshtoken: {
      type: String,
    },
    Studentdetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentdocs",
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
  },
  { timestamps: true }
);

// Middleware to format names
studentSchema.pre("save", async function (next) {
  if (this.isModified("Firstname") || this.isNew) {
    this.Firstname = this.Firstname.charAt(0).toUpperCase() + this.Firstname.slice(1).toLowerCase();
  }
  if (this.isModified("Lastname") || this.isNew) {
    this.Lastname = this.Lastname.charAt(0).toUpperCase() + this.Lastname.slice(1).toLowerCase();
  }
  next();
});

// Middleware to hash passwords
studentSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcrypt.hash(this.Password, 10);
  next();
});

// Instance methods
studentSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.Password);
};

studentSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { _id: this._id, Email: this.Email },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

studentSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { _id: this._id, Email: this.Email },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

studentSchema.methods.generateResetToken = async function (): Promise<string> {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.forgetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.forgetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await this.save();
  return resetToken;
};

// Create models
const Student = mongoose.model<IStudent>("student", studentSchema);
const StudentDocs = mongoose.model<IStudentDetails>("studentdocs", studentDetailsSchema);

export { Student, StudentDocs };
