import { baseApi } from "@/shared/api";

export interface MarkConversationReadPayload {
  conversationId: string;
  sequence: number;
}

export interface ConversationReadReceipt {
  _id: string;
  conversationId: string;
  userId: string;
  lastReadSequence: number;
  lastReadAt?: string;
  updatedAt?: string;
}

export const markConversationReadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    markConversationRead: build.mutation<ConversationReadReceipt, MarkConversationReadPayload>({
      invalidatesTags: (_result, _error, payload) => [
        "Conversations",
        { id: payload.conversationId, type: "Conversations" },
      ],
      query: ({ conversationId, sequence }) => ({
        body: { sequence },
        method: "POST",
        url: `/conversations/${conversationId}/read`,
      }),
    }),
  }),
});

export const { useMarkConversationReadMutation } = markConversationReadApi;
