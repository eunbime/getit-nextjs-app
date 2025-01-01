import { getServerSession } from "next-auth";
import prisma from "@/helpers/prismadb";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  const session = await getServerSession(authOptions);

  return session;
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}
