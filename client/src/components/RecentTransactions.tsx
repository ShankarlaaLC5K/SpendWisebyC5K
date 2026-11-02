
import type { Transaction } from "../types/transaction";

type RecentTransactionsProps = {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onViewAll?: () => void;
  limit?: number;
  showActions?: boolean;
};

function RecentTransactions({
  transactions,
  onEdit,
  onDelete,
  onViewAll,
  limit,
  showActions = true,
}: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) =>
      new Date(`${b.date}T00:00:00`).getTime() -
      new Date(`${a.date}T00:00:00`).getTime()
  );

  const displayedTransactions =
    limit !== undefined
      ? sortedTransactions.slice(0, limit)
      : sortedTransactions;

  return (
    <section className="h-full min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-6 flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Recent Transactions
        </h2>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="shrink-0 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-5">
        {displayedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex flex-col gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800"
          >
            <div className="min-w-0">
              <h3 className="wrap-break-word font-semibold text-slate-800 dark:text-white">
                {transaction.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {transaction.category} · {formatDate(transaction.date)}
              </p>

              {transaction.description && (
                <p className="mt-1 wrap-break-word text-xs text-slate-400">
                  {transaction.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <p
                className={`text-sm font-semibold ${
                  transaction.type === "income"
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>

              {showActions && (
  <div className="flex items-center gap-2 shrink-0">
    <button
      type="button"
      onClick={() => onEdit(transaction)}
      className="px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-900 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 text-sm font-medium transition-colors"
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() => onDelete(transaction.id)}
      className="px-3 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 text-sm font-medium transition-colors"
    >
      Delete
    </button>
  </div>
)}
            </div>
          </div>
        ))}

        {displayedTransactions.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No transactions found.
          </p>
        )}
      </div>
    </section>
  );
}

export default RecentTransactions;
