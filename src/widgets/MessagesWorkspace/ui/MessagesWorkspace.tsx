import { Button, Typography } from "@mui/material";
import { type FC } from "react";

import { AppModal } from "@/shared/ui/molecules/AppModal/AppModal";
import { ChatInformationSidebar } from "@/widgets/ChatInformationSidebar";
import { ChatWindow } from "@/widgets/ChatWindow";
import { ConversationsSidebar } from "@/widgets/ConversationsSidebar";

import { useMessagesWorkspace } from "../model/useMessagesWorkspace";
import styles from "./MessagesWorkspace.module.scss";

export const MessagesWorkspace: FC = () => {
  const {
    activeConversationId,
    availableConversationUsers,
    canManageConversation,
    chatMembers,
    chatMessages,
    closeDeleteMessageConfirm,
    confirmDeleteMessage,
    conversationAvatar,
    conversationName,
    conversationSubtitle,
    conversationTitleDraft,
    conversationType,
    conversations,
    handleAddConversationMember,
    handleAttachImages,
    handleConversationRoleChange,
    handleConversationTitleChange,
    handleConversationTitleSave,
    handleConversationUserChange,
    handleUploadAudio,
    hasConversations,
    isError,
    isLoading,
    isManagingConversation,
    isMutating,
    managementStatusMessage,
    managementStatusTone,
    newConversationMemberRole,
    newMessage,
    onlineCount,
    pendingDeleteMessageId,
    pendingDeleteMessageText,
    selectedConversationUserId,
    statusMessage,
    statusTone,
    selectConversation,
    typingText,
    setNewMessage,
    sharedFiles,
    submitMessage,
  } = useMessagesWorkspace();

  if (isLoading && !hasConversations) {
    return (
      <div className={styles.emptyState}>
        <Typography>Loading conversations...</Typography>
      </div>
    );
  }

  if (isError && !hasConversations) {
    return (
      <div className={styles.emptyState}>
        <Typography>Unable to load conversations.</Typography>
      </div>
    );
  }

  if (!hasConversations) {
    return (
      <div className={styles.emptyState}>
        <Typography>No conversations yet.</Typography>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <ConversationsSidebar
        activeConversationId={activeConversationId}
        conversations={conversations}
        isError={isError}
        isLoading={isLoading}
        onConversationSelect={selectConversation}
      />

      <ChatWindow
        avatar={conversationAvatar}
        composerStatusMessage={statusMessage}
        composerStatusTone={statusTone}
        title={conversationName}
        members={chatMembers}
        membersCount={chatMembers.length}
        onlineCount={onlineCount}
        messages={chatMessages}
        newMessage={newMessage}
        onAttachImages={handleAttachImages}
        onMessageChange={setNewMessage}
        onMessageSubmit={() => {
          void submitMessage();
        }}
        onUploadAudio={handleUploadAudio}
        isSubmitting={isMutating}
        isLoading={isLoading}
        typingText={typingText}
      />

      <ChatInformationSidebar
        availableUsers={availableConversationUsers}
        canManageConversation={canManageConversation}
        conversationTitle={conversationTitleDraft}
        conversationType={conversationType}
        isMutatingConversation={isManagingConversation}
        managementStatusMessage={managementStatusMessage}
        managementStatusTone={managementStatusTone}
        members={chatMembers}
        memberRole={newConversationMemberRole}
        onAddMember={() => {
          void handleAddConversationMember();
        }}
        onConversationTitleChange={handleConversationTitleChange}
        onConversationTitleSave={() => {
          void handleConversationTitleSave();
        }}
        onMemberRoleChange={handleConversationRoleChange}
        onSelectedUserChange={handleConversationUserChange}
        profileAvatar={conversationAvatar}
        profileName={conversationName}
        profileSubtitle={conversationSubtitle}
        selectedUserId={selectedConversationUserId}
        sharedFiles={sharedFiles}
      />

      <AppModal
        open={Boolean(pendingDeleteMessageId)}
        onClose={closeDeleteMessageConfirm}
        title="Delete message?"
        footer={
          <>
            <Button variant="outlined" onClick={closeDeleteMessageConfirm}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={() => void confirmDeleteMessage()}>
              Delete
            </Button>
          </>
        }
      >
        <Typography>
          {pendingDeleteMessageText
            ? `This message will be deleted: “${pendingDeleteMessageText}”.`
            : "This message will be deleted permanently."}
        </Typography>
      </AppModal>
    </div>
  );
};
