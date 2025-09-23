export interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
}

export interface ChatMessage {
  message: string;
  response: string;
  timestamp: Date;
}

export interface DashboardData {
  total_spent: number;
  transaction_count: number;
  spending_by_category: Record<string, number>;
  recent_expenses: Expense[];
}
