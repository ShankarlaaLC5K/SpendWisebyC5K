
type HeaderProps = {
  onToggleTheme: () => void;
  darkMode: boolean;
  onAddTransaction: () => void;
  activeTab: string;
};

function Header({
  onToggleTheme,
  darkMode,
  onAddTransaction,
  activeTab,
}: HeaderProps) {
  const descriptions: Record<string, string> = {
    Dashboard: "Welcome back! Here's your financial overview.",
    Transactions: "Manage and track all your transactions.",
  };

  return (
    <header className="flex flex-col gap-4 mb-8 md:flex-row md:flex-wrap md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {activeTab}
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          {descriptions[activeTab] ?? "Welcome to SpendWise."}
        </p>
      </div>

      <div className="flex w-full items-center justify-between md:w-auto md:justify-end md:gap-4">
        <button
          type="button"
          onClick={onAddTransaction}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          + Add Transaction
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.42 1.42" />
              <path d="m17.65 17.65 1.42 1.42" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.35 17.65-1.42 1.42" />
              <path d="m19.07 4.93-1.42 1.42" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6.5 6.5 0 0 0 8.268 8.268c.344-.215.825-.003.803.401" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
