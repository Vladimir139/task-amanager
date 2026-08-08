import { baseApi } from "@/shared/api";
import type { ConversationDetailsResponse } from "@/shared/api/types";

export interface AddConversationMemberPayload {
  conversationId: string;
  role: "admin" | "member";
  userId: string;
}

export const addConversationMemberApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addConversationMember: build.mutation<
      ConversationDetailsResponse["members"][number],
      AddConversationMemberPayload
    >({
      invalidatesTags: (_result, _error, payload) => [
        "Conversations",
        { id: payload.conversationId, type: "Conversations" },
      ],
      query: ({ conversationId, ...body }) => ({
        body,
        method: "POST",
        url: `/conversations/${conversationId}/members`,
      }),
    }),
  }),
});

export const { useAddConversationMemberMutation } = addConversationMemberApi;
