"use client";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Tabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex space-x-4">
      {["dashboard", "expenses", "chat"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-md ${
            activeTab === tab
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}
