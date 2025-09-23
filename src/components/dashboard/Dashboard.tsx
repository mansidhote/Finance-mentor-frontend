"use client";

import { useEffect, useState } from "react";
import Tabs from "./Tabs";
import StatsCards from "./StatsCards";
import Charts from "./Charts";
import Expenses from "./Expenses";
import Chat from "./Chat";
import {
  Expense,
  Budget,
  DashboardData,
  ChatMessage,
} from "../../types/finance";
import { fetchDashboard, fetchExpenses, fetchBudgets } from "../../lib/api";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    console.log("Loading data...");
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchExpenses();
    console.log("Fetched expenses data: ", data);
    setExpenses(data);
    setDashboardData(await fetchDashboard());
    setBudgets(await fetchBudgets());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Personal Finance Mentor
            </h1>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <>
            <StatsCards dashboardData={dashboardData} budgets={budgets} />
            <div className="mt-8">
              <Charts dashboardData={dashboardData} />
            </div>
          </>
        )}

        {activeTab === "expenses" && (
          console.log("Expenses: ", expenses),
          <Expenses expenses={expenses} onExpenseAdded={loadData} />
        )}

        {activeTab === "chat" && (
          <Chat chatMessages={chatMessages} setChatMessages={setChatMessages} />
        )}
      </main>
    </div>
  );
}
