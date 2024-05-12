type Message = {
  id?: string;
  sender: string;
  contentType: string;
  content: string;
  emotion?: {
    behavior: string;
    strong: string;
  };
  createdAt: number;
};

export default Message;