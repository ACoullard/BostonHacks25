"use client";

import { useChat } from '@ai-sdk/react';
import { useState } from "react";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();


  console.log(messages)

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900 bg-opacity-90 rounded-lg shadow-lg overflow-hidden">
      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400">
            Start a conversation...
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  m.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {m.parts.map((part) => {
                  switch (part.type) {
                    case "text":
                      return <p key={part.text}>{part.text}</p>;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}