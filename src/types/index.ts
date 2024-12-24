import { Category, Message, Product, User } from "@prisma/client";

export type TUserWithChat = User & {
  conversations: TConversation[];
};

export type TConversation = {
  id: string;
  messages: Message[];
  users: User[];
};

export type TProductWithCategory = Product & {
  category: Category;
};
