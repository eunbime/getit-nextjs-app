import getCurrentUser from "../actions/getCurrentUser";
import ChatClient from "./ChatClient";

export const metadata = {
  // 동적 데이터를 위한 캐시 설정
  cache: "private",
  "Cache-Control": "private, must-revalidate",
};

export const dynamic = "force-dynamic";

const ChatPage = async () => {
  const currentUser = await getCurrentUser();

  return <ChatClient currentUser={currentUser} />;
};

export default ChatPage;
