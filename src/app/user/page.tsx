import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import getCurrentUser from "../actions/getCurrentUser";

const UserPage = async () => {
  const session = await getServerSession(authOptions);
  console.log({ session });

  return <div>로그인 된 유저만 볼 수 있는 페이지</div>;
};

export default UserPage;
