import React from "react";

export default function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border border-gray-200 rounded-md px-3 py-2 outline-0 text-gray-900 placeholder-gray-400 ${className}`}
    />
  );
}
