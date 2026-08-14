import { baseApi } from "@/shared/api";
import type { FileRecord, MessageAudioRecord, MessageRecord } from "@/shared/api/types";

export interface SendMessagePayload {
  conversationId: string;
  kind: "text" | "audio" | "system";
  text?: string;
  audio?: MessageAudioRecord;
  fileIds?: string[];
  replyToMessageId?: string;
  systemPayload?: Record<string, unknown>;
}

export interface UpdateMessagePayload {
  messageId: string;
  text?: string;
  transcript?: string;
}

export interface MarkMessageReadPayload {
  messageId: string;
  sequence: number;
}

export interface UploadAudioMessagePayload {
  conversationId?: string;
  durationMs?: number;
  file: File;
  transcript?: string;
  waveform?: string;
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
    deleteMessage: build.mutation<MessageRecord, { conversationId: string; messageId: string }>({
      invalidatesTags: (_result, _error, payload) => [
        { id: payload.conversationId, type: "ConversationMessages" },
        { id: payload.conversationId, type: "ConversationFiles" },
        "Conversations",
      ],
      query: ({ messageId }) => ({
        method: "DELETE",
        url: `/messages/${messageId}`,
      }),
    }),
    markMessageRead: build.mutation<unknown, MarkMessageReadPayload>({
      invalidatesTags: ["Conversations"],
      query: ({ messageId, sequence }) => ({
        body: { sequence },
        method: "POST",
        url: `/messages/${messageId}/read`,
      }),
    }),
    markMessageUnread: build.mutation<unknown, MarkMessageReadPayload>({
      invalidatesTags: ["Conversations"],
      query: ({ messageId, sequence }) => ({
        body: { sequence },
        method: "POST",
        url: `/messages/${messageId}/unread`,
      }),
    }),
    updateMessage: build.mutation<MessageRecord, UpdateMessagePayload>({
      invalidatesTags: (result) =>
        result
          ? [{ id: result.conversationId, type: "ConversationMessages" as const }, "Conversations"]
          : ["Conversations"],
      query: ({ messageId, ...body }) => ({
        body,
        method: "PATCH",
        url: `/messages/${messageId}`,
      }),
    }),
    uploadAudioMessage: build.mutation<FileRecord, UploadAudioMessagePayload>({
      query: ({ conversationId, durationMs, file, transcript, waveform }) => {
        const formData = new FormData();
        formData.append("file", file);

        if (conversationId) {
          formData.append("conversationId", conversationId);
        }

        if (durationMs !== undefined) {
          formData.append("durationMs", String(durationMs));
        }

        if (transcript) {
          formData.append("transcript", transcript);
        }

        if (waveform) {
          formData.append("waveform", waveform);
        }

        return {
          body: formData,
          method: "POST",
          url: "/messages/audio-upload",
        };
      },
    }),
  }),
});

export const {
  useDeleteMessageMutation,
  useGetConversationMessagesQuery,
  useMarkMessageReadMutation,
  useMarkMessageUnreadMutation,
  useSendMessageMutation,
  useUpdateMessageMutation,
  useUploadAudioMessageMutation,
} = messagesApi;
