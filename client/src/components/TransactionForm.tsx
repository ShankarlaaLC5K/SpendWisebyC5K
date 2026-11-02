
import { useState, type FormEvent } from "react";
import type { Transaction, TransactionType } from "../types/transaction";

type TransactionFormProps = {
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, "id">) => Promise<void>;
  initialTransaction?: Transaction;
};

function TransactionForm({
  onClose,
  onSave,
  initialTransaction,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(
    initialTransaction?.type ?? "expense"
  );
  const [title, setTitle] = useState(initialTransaction?.title ?? "");
  const [amount, setAmount] = useState(
    initialTransaction?.amount.toString() ?? ""
  );
  const [category, setCategory] = useState(
    initialTransaction?.category ?? "Food"
  );
  const [date, setDate] = useState(
    initialTransaction?.date ?? new Date().toLocaleDateString("en-CA")
  );
  const [description, setDescription] = useState(
    initialTransaction?.description ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories =
    type === "income"
      ? ["Salary", "Business", "Freelance", "Investment", "Other"]
      : ["Food", "Shopping", "Bills", "Travel", "Health", "Education", "Other"];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSave({
        title,
        amount: Number(amount),
        category,
        date,
        description,
        type,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/60 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg max-h-[calc(100dvh-1rem)] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl my-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {initialTransaction ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-slate-500 hover:text-red-500 text-2xl disabled:opacity-50"
            aria-label="Close transaction form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setType("income");
                setCategory("Salary");
              }}
              className={`py-2.5 sm:py-3 rounded-xl font-semibold ${
                type === "income"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              Income
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setType("expense");
                setCategory("Food");
              }}
              className={`py-2.5 sm:py-3 rounded-xl font-semibold ${
                type === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              Expense
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-slate-700 dark:text-slate-300">
              Transaction Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Transaction title"
              required
              maxLength={100}
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 sm:py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-slate-700 dark:text-slate-300">
              Amount (₹)
            </label>
            <input
              type="number"
              min="0.01"
              max="1000000000"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
              required
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 sm:py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 sm:py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-slate-700 dark:text-slate-300">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 sm:py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Additional details (optional)"
              rows={2}
              maxLength={500}
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 sm:py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 sm:py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className={`flex-1 py-2.5 sm:py-3 rounded-xl text-white font-semibold disabled:opacity-60 ${
                type === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving
                ? "Saving..."
                : initialTransaction
                  ? "Update Transaction"
                  : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;
