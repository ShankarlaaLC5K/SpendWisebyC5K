
import type { Transaction } from "../types/transaction";

type SummaryCardsProps = {
  transactions: Transaction[];
};

function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Balance",
      amount: totalBalance,
      color: "text-blue-600",
    },
    {
      title: "Total Income",
      amount: totalIncome,
      color: "text-emerald-600",
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      color: "text-red-500",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            {card.title}
          </p>

          <h2 className={`text-xl sm:text-2xl font-bold ${card.color}`}>
            {formatCurrency(card.amount)}
          </h2>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;
