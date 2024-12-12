// apipathservices.ts
export const API_BASE_URL = '/api'//'https://your-api-url.com/api';

export const API_PATHS = {
  USERS: `/users`,
  USER_BY_ID: (userId: number) => `/users/${userId}`,
  UpdateUserById: (userId:string)=> `/users?userid=${userId}`,
  GetSpecificUsers: (roleName: string) => `/users?getspecificusers=${roleName}`,
  CreateRole:"/roles",
  GetAllRoles_Get:"/roles",
  GetRoleId: (userId: number) => `/roles?roleName=${userId}`,
  PatchRoleId: (userId: number) => `/roles?id=${userId}`,
  DelRoleId: (userId: number) => `/roles?id=${userId}`,
  GetAllUsers_Get:"/users",
  CreateUser: `/users`,
  GetUserByEmailId: `/users/?email=`,
  GetUserByEmailId_Post: "/users",

  AssignRoleToUser:"roleUsers",
  Products_Post:"/products",
  GetAllComics_Get:"/comics",
  CreateComics_POSt:"/comics",
  WishList:'/wishlist',
  WishListById:(userId:string) => `/wishlist?userid=${userId}`,
  Cart:'/cart',

  GetCartById:(userId:string) => `/cart?userid=${userId}`,
  RatingReview:"/reviews",
  UpdateReview:(reviewId:string) => `/reviews?id=${reviewId}`,
  GetRatingReviewByComicId:"reviews?comicId=",

  //PROFILES
  PROFILES:'profile',
  PROFILE_BY_ID: (userId:string) => `profile?userid=${userId}`,
  UpdatePROFILE_BY_ID: (Id:string) => `profile?id=${Id}`,

  Order:"/orders",
  GetGlobalOrders:"/orders",
  GetOrdersById:(userId:string) => `/orders?userid=${userId}`,
  DelOrdersById:(userId:string) => `/orders?id=${userId}`,
};
