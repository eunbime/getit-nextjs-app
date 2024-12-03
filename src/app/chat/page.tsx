import getCurrentUser from "../actions/getCurrentUser";
import ChatClient from "./ChatClient";

const ChatPage = async () => {
  const currentUser = await getCurrentUser();

  return <ChatClient currentUser={currentUser} />;
};

export default ChatPage;
