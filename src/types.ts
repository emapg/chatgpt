export type Sender = "user" | "bot";

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

export interface GenerateContentRequest {
  prompt: {
    text: string;
  };
}

export interface GenerateContentResponse {
  candidates: { output: string }[];
}

export interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
}
