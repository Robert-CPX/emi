import Message from "./message.model"

type Conversation = {
  id: string;
  participants: string[];
  createdAt: number;
  updatedAt: number;
  lastMessage?: Message;
};

export default Conversation;