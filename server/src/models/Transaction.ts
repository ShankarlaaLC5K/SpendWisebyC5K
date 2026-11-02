
import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  description: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
