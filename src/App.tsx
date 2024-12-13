import React from "react";
import ChatBot from "./components/ChatBot";

const App: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <ChatBot />
    </div>
  );
};

export default App;
