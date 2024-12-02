import getCurrentUser from "../actions/getCurrentUser";
import ChatClient from "./ChatClient";

const ChatPage = async () => {
  const currentUser = await getCurrentUser();

  return <ChatClient />;
};

export default ChatPage;
