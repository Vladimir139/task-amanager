import { baseApi } from "@/shared/api";
import type {
  ConversationDetailsResponse,
  ConversationRecord,
  FileRecord,
} from "@/shared/api/types";

export const conversationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConversationDetails: build.query<ConversationDetailsResponse, string>({
      providesTags: (_result, _error, conversationId) => [
        { id: conversationId, type: "Conversations" },
      ],
      query: (conversationId) => `/conversations/${conversationId}`,
    }),
    getConversationFiles: build.query<FileRecord[], string>({
      providesTags: (_result, _error, conversationId) => [
        { id: conversationId, type: "ConversationFiles" },
      ],
      query: (conversationId) => `/conversations/${conversationId}/files`,
    }),
    getConversations: build.query<ConversationRecord[], void>({
      providesTags: ["Conversations"],
      query: () => "/conversations",
    }),
  }),
});

export const {
  useGetConversationDetailsQuery,
  useGetConversationFilesQuery,
  useGetConversationsQuery,
} = conversationsApi;
