import { baseApi } from "@/shared/api";
import type { ConversationDetailsResponse } from "@/shared/api/types";

export interface RemoveConversationMemberPayload {
  conversationId: string;
  memberUserId: string;
}

export const removeConversationMemberApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    removeConversationMember: build.mutation<
      ConversationDetailsResponse["members"][number],
      RemoveConversationMemberPayload
    >({
      invalidatesTags: (_result, _error, payload) => [
        "Conversations",
        { id: payload.conversationId, type: "Conversations" },
      ],
      query: ({ conversationId, memberUserId }) => ({
        method: "DELETE",
        url: `/conversations/${conversationId}/members/${memberUserId}`,
      }),
    }),
  }),
});

export const { useRemoveConversationMemberMutation } = removeConversationMemberApi;
