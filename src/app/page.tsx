"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import { useMessages } from "@/lib/providers/chatProvider";

export default function Chat() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { messages, sendMessage, setMessages, status } = useChat();
  const { history } = useMessages();

  useEffect(() => {
    setMessages(history);
  }, [history]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const userInput = input;
    try {
      await sendMessage({ text: userInput });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setInput("");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto stretch">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user"
            ? "User: "
            : message.role === "assistant"
              ? "AI: "
              : ""}
          {message.parts.map((part, i) => {
            if (message.role === "user" || message.role === "assistant") {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            }
          })}
        </div>
      ))}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {status !== "ready" && <p color="blue">Loading AI Response</p>}
        <input
          className="fixed dark:bg-zinc-900 max-w-4xl bottom-0 w-full p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          disabled={status !== "ready"}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
