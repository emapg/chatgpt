import { create } from "zustand";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useChatStore;
