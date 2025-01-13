import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TypeScript interface for the Contact document
export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  status?: boolean; // Optional field (defaulted to `false`)
}

// Define the Contact schema
const contactSchema: Schema<IContact> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false, // Default value is `false`
  },
});

// Define the Contact model
const Contact: Model<IContact> = mongoose.model<IContact>("Contact", contactSchema);

export { Contact };
