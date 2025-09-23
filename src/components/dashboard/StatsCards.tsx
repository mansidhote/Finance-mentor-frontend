import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { DashboardData, Budget } from "../../types/finance";

interface Props {
  dashboardData: DashboardData | null;
  budgets: Budget[];
}

export default function StatsCards({ dashboardData, budgets }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">
              Total Spent This Month
            </p>
            <p className="text-2xl font-bold text-gray-900">
              ${dashboardData?.total_spent?.toFixed(2) || "0.00"}
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
  );
}
