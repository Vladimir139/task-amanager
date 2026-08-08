import { baseApi } from "@/shared/api";
import type { ConversationRecord } from "@/shared/api/types";

export interface UpdateConversationPayload {
  conversationId: string;
  title: string;
}

export const updateConversationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateConversation: build.mutation<ConversationRecord, UpdateConversationPayload>({
      invalidatesTags: (_result, _error, payload) => [
        "Conversations",
        { id: payload.conversationId, type: "Conversations" },
      ],
      query: ({ conversationId, title }) => ({
        body: { title },
        method: "PATCH",
        url: `/conversations/${conversationId}`,
      }),
    }),
  }),
});

export const { useUpdateConversationMutation } = updateConversationApi;
