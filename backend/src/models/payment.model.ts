import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Define the TypeScript interface for the Payment document
export interface IPayment extends Document {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  courseID: Types.ObjectId; // Reference to the Course model
  studentID: Types.ObjectId; // Reference to the Student model
}

// Define the Payment schema
const paymentSchema: Schema<IPayment> = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
});

// Define the Payment model
const Payment: Model<IPayment> = mongoose.model<IPayment>("payment", paymentSchema);

export { Payment };
