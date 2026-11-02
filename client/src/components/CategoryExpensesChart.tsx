
import { memo, useMemo, useRef, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import type { Transaction } from "../types/transaction";

type ChartProps = {
  transactions: Transaction[];
  darkMode: boolean;
};

type ChartItem = {
  category: string;
  amount: number;
  color: string;
};

type SectorData = {
  midAngle?: number;
  outerRadius?: number;
  cx?: number | string;
  cy?: number | string;
  payload?: ChartItem;
};

type TooltipInfo = {
  item: ChartItem;
  left: number;
  top: number;
};

const colors = [
  "#f97316",
  "#6366f1",
  "#10b981",
  "#ec4899",
  "#eab308",
  "#06b6d4",
  "#8b5cf6",
  "#ef4444",
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const ExpensePie = memo(function ExpensePie({
  data,
  onHover,
  onLeave,
}: {
  data: ChartItem[];
  onHover: (data: SectorData) => void;
  onLeave: () => void;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={85}
          paddingAngle={3}
          isAnimationActive
          animationDuration={800}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          {data.map((item) => (
            <Cell key={item.category} fill={item.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
});

function CategoryExpenseChart({
  transactions,
  darkMode,
}: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<TooltipInfo | null>(null);

  const chartData = useMemo(() => {
    const totals: Record<string, number> = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        totals[transaction.category] =
          (totals[transaction.category] || 0) + transaction.amount;
      }
    });

    return Object.entries(totals).map(([category, amount], index) => ({
      category,
      amount,
      color: colors[index % colors.length],
    }));
  }, [transactions]);

  const totalExpenses = useMemo(
    () => chartData.reduce((total, item) => total + item.amount, 0),
    [chartData]
  );

  const handleHover = (data: SectorData) => {
    const container = chartRef.current;

    if (
      !container ||
      !data.payload ||
      data.midAngle == null ||
      data.outerRadius == null ||
      typeof data.cx !== "number" ||
      typeof data.cy !== "number"
    ) {
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    const angle = (-data.midAngle * Math.PI) / 180;

    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const distance = data.outerRadius + 16;

    const pointX = data.cx + dx * distance;
    const pointY = data.cy + dy * distance;

    const tooltipWidth = 160;
    const tooltipHeight = 84;

    const preferredLeft =
      dx >= 0 ? pointX + 10 : pointX - tooltipWidth - 10;

    const left = Math.max(
      8,
      Math.min(preferredLeft, width - tooltipWidth - 8)
    );

    const top = Math.max(
      8,
      Math.min(pointY - tooltipHeight / 2, height - tooltipHeight - 8)
    );

    setHovered({
      item: data.payload,
      left,
      top,
    });
  };

  return (
    <section
      className={`min-w-0 rounded-2xl border p-5 shadow-sm ${
        darkMode
          ? "border-slate-700 bg-slate-800"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Category Expenses
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Expense distribution by category
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-500">
          No expense data available
        </div>
      ) : (
        <>
          <div
            ref={chartRef}
            className="relative mx-auto h-72 w-full max-w-md overflow-hidden"
          >
            <ExpensePie
              data={chartData}
              onHover={handleHover}
              onLeave={() => setHovered(null)}
            />

            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500">
                Total Expenses
              </span>
              <span className="mt-1 text-lg font-bold text-slate-800 dark:text-white">
                {formatCurrency(totalExpenses)}
              </span>
            </div>

            {hovered && (
              <div
                key={hovered.item.category}
                className="pointer-events-none absolute z-20 w-40 max-h-24 overflow-y-auto rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 shadow-xl"
                style={{
                  left: hovered.left,
                  top: hovered.top,
                  animation: "tooltipEaseIn 180ms ease-out both",
                }}
              >
                <p className="wrap-break-word text-sm font-medium text-white">
                  {hovered.item.category}
                </p>
                <p
                  className="mt-1 wrap-break-word text-lg font-bold"
                  style={{ color: hovered.item.color }}
                >
                  {formatCurrency(hovered.item.amount)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            {chartData.map((item) => (
              <div
                key={item.category}
                className="flex min-w-0 items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                    {item.category}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-semibold text-slate-800 dark:text-white">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default CategoryExpenseChart;
