"use client";

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from "react";

export default function ChatBox({ onImageGenerated }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Send message right away
    sendMessage({ text: input });

    // 🔹 Clear input immediately for snappy feel
    const userPrompt = input;
    setInput("");

    // 🔹 Then asynchronously generate image
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await res.json();

      if (data.image && typeof onImageGenerated === "function") {
        onImageGenerated(data.image);
      }
    } catch (err) {
      console.error("Image generation failed:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-[30vw] mx-auto bg-black/70 rounded-lg shadow-lg overflow-hidden font-mono text-green-400 relative">
      {/* Messages Area */}
      <div className="h-[70vh] overflow-y-auto p-4 space-y-1 animate-chat-pulse">
        {messages.length === 0 ? (
          <div className="text-gray-600">Start a conversation...</div>
        ) : (
          messages.map((m, i) => (
            <div
              key={m.id}
              className={`chat-line ${m.role === "user" ? "text-green-400" : "text-gray-400"}`}
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <span>{m.role === "user" ? "You: " : "Bot: "}</span>
              {m.parts.map((part) =>
                part.type === "text" ? <span key={part.text}>{part.text}</span> : null
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-2 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 bg-black text-green-400 placeholder-green-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSend}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-1 rounded transition"
        >
          Send
        </button>
      </div>

      {/* === Pulse Animation Styles === */}
      <style jsx>{`
        @keyframes chatPulse {
          0%, 100% { opacity: 0.9; filter: brightness(0.9); }
          50% { opacity: 1; filter: brightness(1.2); }
        }

        .chat-line {
          animation: chatPulse 3s ease-in-out infinite;
        }

        .chat-line:nth-child(2n) { animation-duration: 3.5s; }
        .chat-line:nth-child(3n) { animation-duration: 2.8s; }
        .chat-line:nth-child(4n) { animation-duration: 3.2s; }
      `}</style>
    </div>
  );
}
