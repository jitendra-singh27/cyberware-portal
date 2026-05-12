/**
 * Standalone API Client
 * Direct fetch-based calls to the Express backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const error: any = new Error(err.message || "Request failed");
    error.response = { data: err, status: res.status };
    throw error;
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────
export const api = {
  auth: {
    me:       ()                    => request<User>("GET",  "/api/auth/me"),
    login:    (data: LoginData)     => request<AuthResponse>("POST", "/api/auth/login",    data),
    register: (data: RegisterData)  => request<AuthResponse>("POST", "/api/auth/register", data),
    logout:   ()                    => request<{ message: string }>("POST", "/api/auth/logout"),
  },
  content: {
    list: (params?: { category?: string; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set("category", params.category);
      if (params?.page)     q.set("page", String(params.page));
      return request<ContentListResponse>("GET", `/api/content?${q}`);
    },
    get: (id: number) => request<Content>("GET", `/api/content/${id}`),
  },
  quizzes: {
    list:   ()                                  => request<Quiz[]>("GET", "/api/quizzes"),
    get:    (id: number)                        => request<QuizDetail>("GET", `/api/quizzes/${id}`),
    submit: (id: number, data: SubmitQuizData)  => request<QuizResult>("POST", `/api/quizzes/${id}/submit`, data),
  },
  news: {
    list: () => request<NewsItem[]>("GET", "/api/news"),
  },
  reports: {
    list:   ()                          => request<Report[]>("GET", "/api/reports"),
    submit: (data: ReportData)          => request<Report>("POST", "/api/reports", data),
  },
  forum: {
    listPosts:    ()                            => request<ForumPost[]>("GET", "/api/forum/posts"),
    createPost:   (data: CreatePostData)        => request<ForumPost>("POST", "/api/forum/posts", data),
    listReplies:  (postId: number)              => request<ForumReply[]>("GET", `/api/forum/posts/${postId}/replies`),
    createReply:  (postId: number, data: { content: string }) =>
      request<ForumReply>("POST", `/api/forum/posts/${postId}/replies`, data),
  },
  admin: {
    stats:   () => request<AdminStats>("GET", "/api/admin/stats"),
    reports: () => request<Report[]>("GET", "/api/reports"),
  },
};

// ── Types ─────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface LoginData    { email: string; password: string; }
export interface RegisterData { name: string; email: string; password: string; }

export interface Content {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  readTime: number;
  contentUrl?: string | null;
  createdAt: string;
}

export interface ContentListResponse {
  items: Content[];
  total: number;
  page: number;
  limit: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questionCount: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export interface QuizDetail extends Omit<Quiz, "questionCount"> {
  questions: QuizQuestion[];
}

export interface SubmitQuizData {
  answers: { questionId: number; answer: "A" | "B" | "C" | "D" }[];
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  feedback: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  severity: string;
  publishedAt: string;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  type: string;
  url?: string | null;
  contactEmail?: string | null;
  status: string;
  reportedAt: string;
}

export interface ReportData {
  title: string;
  description: string;
  type: string;
  url?: string;
  contactEmail?: string;
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: string;
  authorName: string;
  replyCount: number;
  createdAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
}

export interface ForumReply {
  id: number;
  postId: number;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  totalQuizAttempts: number;
  totalReports: number;
  pendingReports: number;
}
