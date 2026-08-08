import { baseApi } from "@/shared/api";
import type {
  DashboardSummaryResponse,
  DashboardTaskAnalyticsItem,
  MessageRecord,
  TaskRecord,
} from "@/shared/api/types";

export type DashboardAnalyticsPeriod = "daily" | "weekly" | "monthly";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardMessagesPreview: build.query<MessageRecord[], void>({
      providesTags: ["Dashboard"],
      query: () => "/dashboard/messages-preview",
    }),
    getDashboardSummary: build.query<DashboardSummaryResponse, void>({
      providesTags: ["Dashboard"],
      query: () => "/dashboard/summary",
    }),
    getDashboardTaskAnalytics: build.query<DashboardTaskAnalyticsItem[], DashboardAnalyticsPeriod>({
      providesTags: ["Dashboard"],
      query: (period) => ({
        params: { period },
        url: "/dashboard/task-analytics",
      }),
    }),
    getDashboardTasks: build.query<TaskRecord[], void>({
      providesTags: ["Dashboard", "Tasks"],
      query: () => "/dashboard/tasks",
    }),
  }),
});

export const {
  useGetDashboardMessagesPreviewQuery,
  useGetDashboardSummaryQuery,
  useGetDashboardTaskAnalyticsQuery,
  useGetDashboardTasksQuery,
} = dashboardApi;
