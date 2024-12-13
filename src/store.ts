import { create } from "zustand";
import { Message, ChatState } from "./types";

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useChatStore;
