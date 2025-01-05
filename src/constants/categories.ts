export type CategoryType =
  | "digital"
  | "appliances"
  | "interior"
  | "women-clothing"
  | "men-clothing"
  | "accessories"
  | "beauty"
  | "sports";

export const CATEGORY_TITLE: Record<CategoryType, string> = {
  digital: "디지털 기기",
  appliances: "생활가전",
  interior: "가구/인테리어",
  "women-clothing": "여성의류",
  "men-clothing": "남성의류",
  accessories: "패션/잡화",
  beauty: "뷰티/미용",
  sports: "스포츠/헬스",
};
