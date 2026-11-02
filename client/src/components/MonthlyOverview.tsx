
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Transaction } from "../types/transaction";

type MonthlyOverviewProps = {
  transactions: Transaction[];
  darkMode: boolean;
};

function MonthlyOverview({
  transactions,
  darkMode,
}: MonthlyOverviewProps) {
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    const month = date.getMonth();
    const year = date.getFullYear();

    const monthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(`${transaction.date}T00:00:00`);

      return (
        transactionDate.getMonth() === month &&
        transactionDate.getFullYear() === year
      );
    });

    return {
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      income: monthTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0),
      expenses: monthTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0),
    };
  });

  const textColor = darkMode ? "#cbd5e1" : "#64748b";
  const gridColor = darkMode ? "#334155" : "#e2e8f0";

  return (
    <section
      className={`min-w-0 w-full overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-sm ${
        darkMode
          ? "border-slate-700 bg-slate-800"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-5">
        <h2
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-slate-800"
          }`}
        >
          Monthly Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Income vs expenses over the last 6 months
        </p>
      </div>

      <div className="h-64 sm:h-72 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />

            <YAxis
              width={55}
              tick={{ fill: textColor, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                value >= 100000
                  ? `₹${(value / 100000).toFixed(0)}L`
                  : `₹${(value / 1000).toFixed(0)}k`
              }
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
              ]}
              contentStyle={{
                backgroundColor: darkMode ? "#1e293b" : "#ffffff",
                border: `1px solid ${gridColor}`,
                borderRadius: "12px",
                color: darkMode ? "#ffffff" : "#0f172a",
              }}
            />

            <Legend
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: "8px",
              }}
            />

            <Bar
              dataKey="income"
              name="Income"
              fill="#10b981"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#f97316"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MonthlyOverview;
