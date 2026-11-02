
import { Router } from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";

const router = Router();

router.route("/")
  .get(getTransactions)
  .post(createTransaction);

router.route("/:id")
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
