"use client";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Expense } from "../../types/finance";
import { createExpense } from "../../lib/api";

interface Props {
  expenses: Expense[];
  onExpenseAdded: () => void;
}

export default function Expenses({ expenses, onExpenseAdded }: Props) {
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const addExpense = async () => {
    if (!newExpense.amount || !newExpense.description) return;
    setLoading(true);
    await createExpense({
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      category: newExpense.category || undefined,
    });
    setNewExpense({ amount: "", description: "", category: "" });
    onExpenseAdded();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Add New Expense
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            className="border border-gray-200 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            className="border border-gray-200 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400"
          />
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="border border-gray-200 rounded-md px-3 py-2 text-gray-900"
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
            <PlusCircle className="h-4 w-4 inline mr-2" /> Add Expense
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Expenses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.description}
                  </td>
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
  );
}
