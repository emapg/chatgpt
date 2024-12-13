import React, { useState } from "react";
import axios from "axios";
import useChatStore from "../store";
import { Send, User, Bot } from "lucide-react"; // Using correct Bot icon
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Message } from "../types";

const ChatBot: React.FC = () => {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      sender: "user",
      text: input,
      timestamp: Date.now(),
    };
    addMessage(userMessage);
    setInput("");

    setIsTyping(true);

    try {
      // Post to Gemini API with the correct structure based on your provided curl
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: input, // Pass the input as the prompt
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful response from the API
      const botReply: Message = {
        id: `${Date.now()}-bot`,
        sender: "bot",
        text:
          response.data?.candidates?.[0]?.output ||
          "Sorry, I didn't understand that.",
        timestamp: Date.now(),
      };
      addMessage(botReply);
    } catch (error) {
      console.error("API Error:", error);
      addMessage({
        id: `${Date.now()}-bot-error`,
        sender: "bot",
        text: "Error connecting to the API. Please try again later.",
        timestamp: Date.now(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-gray-100 shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 rounded-md shadow">
        <h1 className="text-lg font-semibold">AI Chatbot</h1>
        <Bot size={24} />
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto bg-white p-4 rounded-md shadow-md mt-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <ReactMarkdown
                components={{
                  code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className}>{children}</code>
                    );
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
              <span className="block mt-2 text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {msg.sender === "user" && (
              <div className="flex-shrink-0">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-gray-500 italic mt-2">Bot is typing...</div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
          onClick={sendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
