import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the TypeScript interface for the Admin document
export interface IAdmin extends Document {
    username: string;
    password: string;
    Refreshtoken?: string; // Optional field
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
  }

// Define the Admin schema
const adminSchema: Schema<IAdmin> = new Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    Refreshtoken: {
      type: String,
    },
  });

  // Hash the password before saving
adminSchema.pre<IAdmin>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

adminSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  };

  // Method to generate an access token
adminSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
      {
        _id: this._id,
        username: this.username,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };

  // Method to generate a refresh token
adminSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
      {
        _id: this._id,
        username: this.username,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };

  // Define the Admin model
const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export { Admin };