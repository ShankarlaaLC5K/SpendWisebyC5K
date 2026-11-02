
import type { Transaction } from "../types/transaction";

type QuickInsightsProps = {
  transactions: Transaction[];
};

function QuickInsights({ transactions }: QuickInsightsProps) {
  const getCategoryTotal = (type: "income" | "expense") => {
    const totals = transactions
      .filter((transaction) => transaction.type === type)
      .reduce<Record<string, number>>((result, transaction) => {
        result[transaction.category] =
          (result[transaction.category] ?? 0) + transaction.amount;

        return result;
      }, {});

    const topCategory = Object.entries(totals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return topCategory
      ? { category: topCategory[0], amount: topCategory[1] }
      : null;
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const savingsRate =
    totalIncome > 0
      ? ((totalIncome - totalExpenses) / totalIncome) * 100
      : 0;

  const topIncome = getCategoryTotal("income");
  const topExpense = getCategoryTotal("expense");

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const insights = [
    {
      title: "Top Income",
      value: topIncome?.category ?? "No data",
      amount: topIncome ? formatCurrency(topIncome.amount) : "",
      color: "text-emerald-600",
      icon: "↗",
    },
    {
      title: "Top Expense",
      value: topExpense?.category ?? "No data",
      amount: topExpense ? formatCurrency(topExpense.amount) : "",
      color: "text-red-500",
      icon: "↘",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      amount: "Based on total income",
      color: "text-blue-600",
      icon: "₹",
    },
    {
      title: "Total Transactions",
      value: transactions.length.toString(),
      amount: "Recorded transactions",
      color: "text-violet-600",
      icon: "#",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Quick Insights
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your financial highlights
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className="min-w-0 flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
          >
            <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-lg font-bold text-slate-600 dark:text-slate-300">
              {insight.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {insight.title}
              </p>

              <p className={`font-semibold truncate ${insight.color}`}>
                {insight.value}
              </p>

              {insight.amount && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {insight.amount}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default QuickInsights;
