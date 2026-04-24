// ============== Pagination ==============
export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============== API Response ==============
export interface ApiResponse<T = any> {
  status: number;
  message?: string;
  data: T;
}

// ============== User ==============
export interface User {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  taxCode?: string;
  status: "active" | "inActive";
  verification: boolean;
  roles: ("ADMIN" | "PARTNER" | "USER")[];
  favorites?: string[];
  invoiceInformation?: {
    invoiceName?: string;
    invoiceEmail?: string;
    companyName?: string;
    companyTaxCode?: string;
    address?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ============== Post ==============
export interface PostImage {
  filename: string;
  path: string;
}

export interface PostAuthor {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  address?: string;
  avatar?: string;
}

export interface PostCategory {
  _id: string;
  name: string;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  overview?: string;
  type: "RENT" | "SELL";
  images: PostImage[];
  price: number;
  address: string;
  acreage?: number;
  category?: PostCategory | string;
  author?: PostAuthor | string;
  status: "in-stock" | "out-of-stock";
  verification: boolean;
  views: number;
  favorites: number;
  isDelete: "active" | "inActive";
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============== Category ==============
export interface Category {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inActive";
  createdAt?: string;
}

// ============== News ==============
export interface News {
  _id: string;
  title: string;
  content: string;
  thumb?: string;
  tags?: string[];
  isDelete: "active" | "inActive";
  createdAt?: string;
}

// ============== Report ==============
export interface Report {
  _id: string;
  author: User | string;
  post: Post | string;
  phone?: string;
  reason: string;
  content: string;
  status: "pending" | "resolved" | "rejected";
  createdAt?: string;
}

// ============== Application ==============
export interface Application {
  _id: string;
  name: string;
  phone: string;
  email: string;
  content: string;
  post: Post | string;
  author: User | string;
  createdAt?: string;
}

// ============== Auth ==============
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  userName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  taxCode?: string;
}

export interface LoginResponse {
  user: Pick<User, "_id" | "userName" | "email" | "phone">;
  tokens: { accessToken: string };
}

// ============== Summary ==============
export interface OverallSummary {
  users: { total: number; active: number; inactive: number };
  posts: {
    total: number;
    active: number;
    inactive: number;
    rent: number;
    sell: number;
  };
  reports: { total: number; pending: number; resolved: number };
  news: { total: number; active: number; inactive: number };
  categories: { total: number };
}

export interface AuthorSummary {
  author: { id: string; userName: string; email: string };
  stats: {
    totalPosts: number;
    totalViews: number;
    totalFavorites: number;
    avgPrice: number;
    rentPosts: number;
    sellPosts: number;
  };
  recentPosts: Post[];
}

// ============== Filters ==============
export interface PostFilters {
  category?: string;
  address?: string;
  price?: string;
  area?: string;
  type?: "RENT" | "SELL";
  sort?: string;
  [key: string]: string | undefined;
}
