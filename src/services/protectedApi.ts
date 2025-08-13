import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config";
import {
  AddCommentRequest,
  AddCommentResponse,
  AddReplyRequest,
  categoryResponse,
  FeedBack,
  FeedBackResponse,
} from "./api.types";

import {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";

// import { FetchArgs } from "@reduxjs/toolkit/query/react";
import * as tags from "./tags"; // Import all tags
import { toast } from "react-toastify";
import { logout } from "../store/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, api) => {
    const { auth } = api.getState() as { auth: { token: string | undefined } };
    if (auth?.token) {
      headers.set("Authorization", `Bearer ${auth.token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  let err = result?.error as any;
  if (err && err.error && err.error.statusCode === 401) {
    // logout
    toast.error("Your session has expired, please log in again.");
    setTimeout(() => {
      api.dispatch(logout());
    }, 1000);
  }

  return result;
};

export const protectedApi = createApi({
  reducerPath: "protectedApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Feedback", "singleFeedback", "singleComment"],
  endpoints: (builder) => ({
    createFeedback: builder.mutation({
      query: (feedbackData) => ({
        url: "/feedback",
        method: "POST",
        body: feedbackData,
      }),
      invalidatesTags: ["Feedback"],
    }),
    // get feedback
    // getFeedback: builder.query<FeedBackResponse, void>({
    //   query: () => ({
    //     url: "/feedback",
    //     method: "GET",
    //   }),
    //   providesTags: ["Feedback"],
    // }),
    // services/protectedApi.ts
    // services/protectedApi.ts
    getFeedback: builder.query<
      { feedbacks: FeedBack[] },
      { category?: string; sort?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append("category", params.category);
        if (params?.sort) queryParams.append("sort", params.sort);

        return {
          url: `/feedback?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Feedback"],
    }),

    getFeedbackById: builder.query<FeedBack, string>({
      query: (id) => ({
        url: `/feedback/${id}`,
        method: "GET",
      }),
      providesTags: ["singleFeedback"],
    }),
    updateFeedback: builder.mutation<FeedBackResponse, FeedBack>({
      query: (feedbackData) => ({
        url: `/feedback/${feedbackData.id}`,
        method: "PUT",
        body: feedbackData,
      }),
      invalidatesTags: ["Feedback", "singleFeedback"],
    }),

    // add comment on figma
    addComment: builder.mutation<AddCommentResponse, AddCommentRequest>({
      query: (commentData) => ({
        url: "/comments",
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["singleFeedback", "singleComment"],
    }),

    // get comments by feedback id
    getCommentsByFeedbackId: builder.query<Comment[], string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "GET",
      }),
      providesTags: ["singleComment"],
    }),

    //upvoteFeedback
    upvoteFeedback: builder.mutation<
      any,
      { id: string | number; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `/feedback/${id}/upvote`,
        method: "POST",
        body: { id, userId },
      }),
      invalidatesTags: ["Feedback", "singleFeedback"],
    }),

    // reply comment
    addReply: builder.mutation<any, AddReplyRequest>({
      query: (replyData) => ({
        url: "/feedback/reply",
        method: "POST",
        body: replyData,
      }),
      invalidatesTags: ["Feedback", "singleFeedback"],
    }),

    // get status count
    getStatusCount: builder.query<Record<string, any>, void>({
      query: () => ({
        url: "/feedback/status-count",
        method: "GET",
      }),
    }),

    updateFeedbackStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `feedback/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),

    // get categoris
    getCategories: builder.query<categoryResponse, void>({
      query: () => ({
        url: "/feedback/categories",
        method: "GET",
      }),
    }),
  }),
}).enhanceEndpoints({ addTagTypes: Object.values(tags) });

export const {
  useCreateFeedbackMutation,
  useGetCategoriesQuery,
  useGetFeedbackQuery,
  useGetFeedbackByIdQuery,
  useUpdateFeedbackMutation,
  useAddCommentMutation,
  useAddReplyMutation,
  useGetStatusCountQuery,
  useUpdateFeedbackStatusMutation,
  useUpvoteFeedbackMutation,
  useGetCommentsByFeedbackIdQuery,
} = protectedApi;
