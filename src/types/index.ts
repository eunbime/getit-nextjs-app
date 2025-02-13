import {
  Category,
  Comment,
  Like,
  Message,
  Post,
  Product,
  Reply,
  Subcategory,
  User,
} from "@prisma/client";

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

export type TLikeWithProduct = Like & {
  product: TProductWithCategory & {
    category: Category;
  };
};

export type TCategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};

export type TPostWithCategoryWithAuthor = Post & {
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  author: User;
};

export type TCommentWithUserWithReplies = Comment & {
  user: User;
  replies: (Reply & {
    user: User;
  })[];
};

export type TReplyWithUser = Reply & {
  user: User;
};
