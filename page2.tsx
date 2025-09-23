'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, MessageCircle, DollarSign, TrendingUp, Calendar, Send } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Types
interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
}

interface ChatMessage {
  message: string;
  response: string;
  timestamp: Date;
}

interface DashboardData {
  total_spent: number;
  transaction_count: number;
  spending_by_category: Record<string, number>;
  recent_expenses: Expense[];
}

const API_BASE = 'http://localhost:8000';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Dashboard() {
  // State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newExpense, setNewExpense] = useState({ amount: '', description: '', category: '' });
  const [newBudget, setNewBudget] = useState({ category: '', amount: '', month: '2024-08' });
  const [chatInput, setChatInput] = useState('');
  
  // UI states
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load data on mount
  useEffect(() => {
    loadDashboard();
    loadExpenses();
    loadBudgets();
  }, []);

  // API calls
  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const loadExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/expenses`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const loadBudgets = async () => {
    try {
      const response = await fetch(`${API_BASE}/budgets`);
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  const addExpense = async () => {
    if (!newExpense.amount || !newExpense.description) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(newExpense.amount),
          description: newExpense.description,
          category: newExpense.category || undefined
        })
      });
      
      if (response.ok) {
        setNewExpense({ amount: '', description: '', category: '' });
        await loadExpenses();
        await loadDashboard();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async () => {
    if (!newBudget.category || !newBudget.amount) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newBudget.category,
          amount: parseFloat(newBudget.amount),
          month: newBudget.month
        })
      });
      
      if (response.ok) {
        setNewBudget({ category: '', amount: '', month: '2024-08' });
        await loadBudgets();
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatInput })
      });
      
      const data = await response.json();
      setChatMessages(prev => [...prev, {
        message: chatInput,
        response: data.response,
        timestamp: new Date()
      }]);
      setChatInput('');
    } catch (error) {
      console.error('Error sending chat:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const pieData = dashboardData && dashboardData.spending_by_category ? Object.entries(dashboardData.spending_by_category).map(([category, amount]) => ({
    name: category,
    value: amount
  })) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Personal Finance Mentor</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-500'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-2 rounded-md ${activeTab === 'expenses' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-500'}`}
              >
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-md ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-blue-500'}`}
              >
                AI Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Spent This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${dashboardData?.total_spent?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.transaction_count || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Budgets</p>
                    <p className="text-2xl font-bold text-gray-900">{budgets.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No expenses to display</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h3>
                <div className="space-y-3">
                  {dashboardData?.recent_expenses?.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                      </div>
                      <p className="font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                    </div>
                  )) || <p className="text-gray-500">No recent expenses</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            {/* Add Expense Form */}
            <div className="bg-white p-6 rounded-lg shadow ">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Expense</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="border border-gray-200 rounded-md px-3 py-2 outline-0  text-gray-700 placeholder-gray-400"
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="border border-gray-200 rounded-md px-3 py-2 outline-0 text-gray-900 placeholder-gray-400"
                />

                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="border border-gray-200 rounded-md px-3 py-2 outline-0 text-gray-400"
                >
                  <option value="">Auto-categorize</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  onClick={addExpense}
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  <PlusCircle className="h-4 w-4 inline mr-2" />
                  Add Expense
                </button>
              </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Expenses</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${expense.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow" style={{ height: '600px' }}>
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">AI Finance Mentor</h3>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation about your finances!</p>
                    <p className="text-sm mt-2">Try asking: "How am I doing with my spending this month?"</p>
                  </div>
                )}
                
                {chatMessages.map((msg, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-md">
                        {msg.message}
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-md">
                        {msg.response}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Ask about your finances..."
                    className="flex-1 border border-gray-200 outline-0 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={loading || !chatInput.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}