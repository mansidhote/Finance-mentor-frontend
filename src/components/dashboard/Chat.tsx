"use client";
import { useState } from "react";
import { ChatMessage } from "../../types/finance";
import { sendChat } from "../../lib/api";

interface Props {
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
}

export default function Chat({ chatMessages, setChatMessages }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message) return;
    setLoading(true);
    const res = await sendChat(message);
    setChatMessages([
      ...chatMessages,
      { message, response: res.response, timestamp: new Date() },
    ]);
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col h-[500px]">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Finance Chat Assistant
      </h3>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chatMessages.map((chat, idx) => (
          <div key={idx} className="space-y-2">
            <div className="bg-blue-100 p-3 rounded-lg max-w-lg ml-auto">
              <p className="text-sm text-gray-900">{chat.message}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg max-w-lg">
              <p className="text-sm text-gray-900">{chat.response}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Ask about your finances..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
