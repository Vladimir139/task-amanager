import { baseApi } from "@/shared/api";
import type { MessageAudioRecord, MessageRecord } from "@/shared/api/types";

export interface SendMessagePayload {
  conversationId: string;
  kind: "text" | "audio" | "system";
  text?: string;
  audio?: MessageAudioRecord;
  fileIds?: string[];
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConversationMessages: build.query<MessageRecord[], string>({
      providesTags: (_result, _error, conversationId) => [
        { id: conversationId, type: "ConversationMessages" },
      ],
      query: (conversationId) => `/conversations/${conversationId}/messages`,
    }),
    sendMessage: build.mutation<MessageRecord, SendMessagePayload>({
      invalidatesTags: (_result, _error, payload) => [
        { id: payload.conversationId, type: "ConversationMessages" },
        { id: payload.conversationId, type: "ConversationFiles" },
        "Conversations",
      ],
      query: ({ conversationId, ...body }) => ({
        body,
        method: "POST",
        url: `/conversations/${conversationId}/messages`,
      }),
    }),
  }),
});

export const { useGetConversationMessagesQuery, useSendMessageMutation } = messagesApi;
