
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import QuickInsights from "./components/QuickInsights";
import RecentTransactions from "./components/RecentTransactions";
import TransactionForm from "./components/TransactionForm";
import TransactionFilters from "./components/TransactionFilters";
import MonthlyOverview from "./components/MonthlyOverview";
import CategoryExpenseChart from "./components/CategoryExpensesChart";
import IncomeCategoryChart from "./components/IncomeCategoryChart";
import type { Transaction } from "./types/transaction";

const API_URL = `${import.meta.env.VITE_API_URL}/api/transactions`;

type ApiTransaction = {
  _id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  description: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const mapTransaction = (transaction: ApiTransaction): Transaction => ({
  id: transaction._id,
  title: transaction.title,
  category: transaction.category,
  date: transaction.date.slice(0, 10),
  amount: transaction.amount,
  type: transaction.type,
  description: transaction.description ?? "",
});

async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Something went wrong. Please try again."
    );
  }

  return result as T;
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("spendwise-theme") === "dark";
  });

  const [activeTab, setActiveTab] = useState("Dashboard");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [date, setDate] = useState("");

  useEffect(() => {
    localStorage.setItem("spendwise-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setApiError("");

        const result = await apiRequest<ApiResponse<ApiTransaction[]>>(
          API_URL
        );

        setTransactions(result.data.map(mapTransaction));
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const toggleTheme = () => {
    setDarkMode((previousMode) => !previousMode);
  };

  const handleAddTransaction = async (
    transaction: Omit<Transaction, "id">
  ) => {
    const isEditing = editingTransaction !== null;

    const url = isEditing
      ? `${API_URL}/${editingTransaction.id}`
      : API_URL;

    const result = await apiRequest<ApiResponse<ApiTransaction>>(url, {
      method: isEditing ? "PUT" : "POST",
      body: JSON.stringify(transaction),
    });

    const savedTransaction = mapTransaction(result.data);

    if (isEditing) {
      setTransactions((previousTransactions) =>
        previousTransactions.map((item) =>
          item.id === savedTransaction.id ? savedTransaction : item
        )
      );
    } else {
      setTransactions((previousTransactions) => [
        savedTransaction,
        ...previousTransactions,
      ]);
    }

    setApiError("");
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest<ApiResponse<null>>(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setTransactions((previousTransactions) =>
        previousTransactions.filter((item) => item.id !== id)
      );

      setApiError("");
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete transaction"
      );
    }
  };

  const handleCloseForm = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const categories = Array.from(
    new Set(transactions.map((transaction) => transaction.category))
  );

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = type === "all" || transaction.type === type;

    const matchesCategory =
      category === "all" || transaction.category === category;

    const matchesDate = !date || transaction.date === date;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesDate
    );
  });

  const clearFilters = () => {
    setSearch("");
    setType("all");
    setCategory("all");
    setDate("");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="app-layout min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main className="app-main box-border w-full max-w-full min-w-0 flex-1 overflow-x-hidden px-4 pt-20 pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:p-10">
          <Header
            onToggleTheme={toggleTheme}
            darkMode={darkMode}
            onAddTransaction={() => {
              setEditingTransaction(null);
              setShowTransactionForm(true);
            }}
            activeTab={activeTab}
          />

          {apiError && (
            <div className="my-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {apiError}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <p className="text-slate-500 dark:text-slate-400">
                Loading transactions...
              </p>
            </div>
          ) : (
            <>
              {activeTab === "Dashboard" && (
                <>
                  <div className="mb-6 space-y-6">
                    <SummaryCards transactions={transactions} />
                    <QuickInsights transactions={transactions} />
                  </div>

                  <div className="my-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <MonthlyOverview
                      transactions={transactions}
                      darkMode={darkMode}
                    />

                    <RecentTransactions
                      transactions={transactions}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                      onViewAll={() => setActiveTab("Transactions")}
                      limit={4}
                      showActions={false}
                    />

                    <CategoryExpenseChart
                      transactions={transactions}
                      darkMode={darkMode}
                    />

                    <IncomeCategoryChart
                      transactions={transactions}
                      darkMode={darkMode}
                    />
                  </div>
                </>
              )}

              {activeTab === "Transactions" && (
                <>
                  <TransactionFilters
                    search={search}
                    setSearch={setSearch}
                    type={type}
                    setType={setType}
                    category={category}
                    setCategory={setCategory}
                    date={date}
                    setDate={setDate}
                    categories={categories}
                    onClear={clearFilters}
                  />

                  <div className="mt-6">
                    <RecentTransactions
                      transactions={filteredTransactions}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {showTransactionForm && (
        <TransactionForm
          key={editingTransaction?.id ?? "new"}
          onClose={handleCloseForm}
          onSave={handleAddTransaction}
          initialTransaction={editingTransaction ?? undefined}
        />
      )}
    </div>
  );
}

export default App;
