import React, { useState } from "react";
import axios from "axios";
import useChatStore from "../store";
import { Send, User, Robot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatBot: React.FC = () => {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    addMessage({ sender: "user", text: input });
    setInput("");

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText",
        {
          prompt: { text: input },
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GOOGLE_API_KEY}`,
          },
        }
      );

      const botReply = response.data?.candidates?.[0]?.output || "No response.";
      addMessage({ sender: "bot", text: botReply });
    } catch (error) {
      addMessage({ sender: "bot", text: "Error connecting to the API." });
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-gray-100 shadow-lg rounded-lg">
      <div className="flex-1 overflow-y-auto bg-white p-4 rounded-md shadow-md">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
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
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={sendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
