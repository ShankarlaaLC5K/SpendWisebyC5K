
import { useState } from "react";

type SidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["Dashboard", "Transactions"];

  const handleNavigation = (item: string) => {
    onTabChange(item);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-60 flex items-center justify-start gap-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="w-11 h-11 shrink-0 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <span className="text-2xl leading-none text-slate-900 dark:text-white">
              ×
            </span>
          ) : (
            <>
              <span className="block w-5 h-0.5 rounded bg-slate-900 dark:bg-white" />
              <span className="block w-5 h-0.5 rounded bg-slate-900 dark:bg-white" />
              <span className="block w-5 h-0.5 rounded bg-slate-900 dark:bg-white" />
            </>
          )}
        </button>

        <h2 className="text-xl font-bold text-blue-600">
          SpendWise
        </h2>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-200 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 lg:p-6 flex flex-col shrink-0 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0`}
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6 lg:mb-12">
          SpendWise
        </h2>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleNavigation(item)}
              className={`text-left rounded-xl px-4 py-3 transition-colors ${
                activeTab === item
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
