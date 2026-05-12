/**
 * React Query hooks that wrap the API client.
 * These replace the @workspace/api-client-react generated hooks.
 */

import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { 
  api, 
  type User,
  type AuthResponse,
  type LoginData, 
  type RegisterData, 
  type Content,
  type ContentListResponse,
  type Quiz,
  type QuizDetail,
  type QuizResult,
  type SubmitQuizData, 
  type NewsItem,
  type Report,
  type ReportData, 
  type ForumPost,
  type CreatePostData,
  type ForumReply,
  type AdminStats
} from "./api-client";

// ── Auth ──────────────────────────────────────────────────
export const useGetCurrentUser = (opts?: { query?: Partial<UseQueryOptions<User | null>> }) =>
  useQuery({ 
    queryKey: ["/api/auth/me"], 
    queryFn: api.auth.me, 
    ...opts?.query 
  });

export const useLoginUser = (opts?: { mutation?: UseMutationOptions<AuthResponse, Error, { data: LoginData }> }) =>
  useMutation({ 
    mutationFn: (vars: { data: LoginData }) => api.auth.login(vars.data), 
    ...opts?.mutation 
  });

export const useRegisterUser = (opts?: { mutation?: UseMutationOptions<AuthResponse, Error, { data: RegisterData }> }) =>
  useMutation({ 
    mutationFn: (vars: { data: RegisterData }) => api.auth.register(vars.data), 
    ...opts?.mutation 
  });

export const useLogoutUser = (opts?: { mutation?: UseMutationOptions<{ message: string }, Error, void> }) =>
  useMutation({ 
    mutationFn: () => api.auth.logout(), 
    ...opts?.mutation 
  });

// ── Content ───────────────────────────────────────────────
export const useListContent = (params?: { category?: string; page?: number }) =>
  useQuery({ 
    queryKey: ["/api/content", params], 
    queryFn: () => api.content.list(params) 
  });

export const useGetContent = (id: number) =>
  useQuery({ 
    queryKey: ["/api/content", id], 
    queryFn: () => api.content.get(id), 
    enabled: !!id 
  });

// ── Quizzes ───────────────────────────────────────────────
export const useListQuizzes = () =>
  useQuery({ 
    queryKey: ["/api/quizzes"], 
    queryFn: api.quizzes.list 
  });

export const useGetQuiz = (id: number, opts?: { query?: Partial<UseQueryOptions<QuizDetail>> }) =>
  useQuery({ 
    queryKey: ["/api/quizzes", id], 
    queryFn: () => api.quizzes.get(id), 
    enabled: !!id, 
    ...opts?.query 
  });

export const useSubmitQuiz = (opts?: { mutation?: UseMutationOptions<QuizResult, Error, { id: number; data: SubmitQuizData }> }) =>
  useMutation({
    mutationFn: (vars: { id: number; data: SubmitQuizData }) => api.quizzes.submit(vars.id, vars.data),
    ...opts?.mutation,
  });

// ── News ──────────────────────────────────────────────────
export const useListNews = () =>
  useQuery({ 
    queryKey: ["/api/news"], 
    queryFn: api.news.list 
  });

// ── Reports ───────────────────────────────────────────────
export const useListReports = () =>
  useQuery({ 
    queryKey: ["/api/reports"], 
    queryFn: api.reports.list 
  });

export const useSubmitReport = (opts?: { mutation?: UseMutationOptions<Report, Error, { data: ReportData }> }) =>
  useMutation({ 
    mutationFn: (vars: { data: ReportData }) => api.reports.submit(vars.data), 
    ...opts?.mutation 
  });

// ── Forum ─────────────────────────────────────────────────
export const useListForumPosts = () =>
  useQuery({ 
    queryKey: ["/api/forum/posts"], 
    queryFn: api.forum.listPosts 
  });

export const useCreateForumPost = (opts?: { mutation?: UseMutationOptions<ForumPost, Error, { data: CreatePostData }> }) =>
  useMutation({ 
    mutationFn: (vars: { data: CreatePostData }) => api.forum.createPost(vars.data), 
    ...opts?.mutation 
  });

export const useListForumPostReplies = (postId: number) =>
  useQuery({ 
    queryKey: ["/api/forum/posts", postId, "replies"], 
    queryFn: () => api.forum.listReplies(postId), 
    enabled: !!postId 
  });

export const useCreateForumPostReply = (opts?: { mutation?: UseMutationOptions<ForumReply, Error, { postId: number; data: { content: string } }> }) =>
  useMutation({
    mutationFn: (vars: { postId: number; data: { content: string } }) => api.forum.createReply(vars.postId, vars.data),
    ...opts?.mutation,
  });

// ── Admin ─────────────────────────────────────────────────
export const useGetAdminStats = () =>
  useQuery({ 
    queryKey: ["/api/admin/stats"], 
    queryFn: api.admin.stats 
  });

export const useListAdminReports = () =>
  useQuery({ 
    queryKey: ["/api/reports"], 
    queryFn: api.admin.reports 
  });

// Aliases used by forum detail page
export const useGetForumReplies = (postId: number, opts?: { query?: Partial<UseQueryOptions<ForumReply[]>> }) =>
  useQuery({ 
    queryKey: ["/api/forum/posts", postId, "replies"], 
    queryFn: () => api.forum.listReplies(postId), 
    enabled: !!postId, 
    ...opts?.query 
  });

export const useCreateForumReply = (opts?: { mutation?: UseMutationOptions<ForumReply, Error, { id: number; data: { content: string } }> }) =>
  useMutation({
    mutationFn: (vars: { id: number; data: { content: string } }) => api.forum.createReply(vars.id, vars.data),
    ...opts?.mutation,
  });
