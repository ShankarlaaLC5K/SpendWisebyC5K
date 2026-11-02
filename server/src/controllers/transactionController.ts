
import type { Request, Response } from "express";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const getTransactions = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions"
    });
  }
};

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    if (!title || amount == null || !type || !category || !date) {
      res.status(400).json({
        success: false,
        message: "Please provide all required transaction fields"
      });
      return;
    }

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      description
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to create transaction"
    });
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
      return;
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update transaction"
    });
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid transaction ID"
      });
      return;
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully"
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete transaction"
    });
  }
};
