import * as dotenv from 'dotenv';

dotenv.config();

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/dashboard`);
  console.log("Dashboard data response: ", res);
  return res.json();
}

export async function fetchExpenses() {
  const res = await fetch(`${API_BASE}/expenses`);
  console.log("Expenses data response: ", res);
  return res.json();
}

export async function fetchBudgets() {
  const res = await fetch(`${API_BASE}/budgets`);
  return res.json();
}

export async function createExpense(expense: { amount: number; description: string; category?: string }) {
  console.log("API_BASE: ", API_BASE);
  return fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
}

export async function createBudget(budget: { category: string; amount: number; month: string }) {
  return fetch(`${API_BASE}/budgets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budget),
  });
}

export async function sendChat(message: string) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
}
