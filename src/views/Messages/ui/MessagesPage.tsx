import { type FC, useState } from "react";

import { ChatInformationSidebar, ChatWindow, ConversationsSidebar } from "@/widgets";

import styles from "./MessagesPage.module.scss";

export const MessagesPage: FC = () => {
  const [activeConversationId, setActiveConversationId] = useState(2);

  return (
    <div className={styles.page}>
      <ConversationsSidebar
        activeConversationId={activeConversationId}
        onConversationSelect={setActiveConversationId}
      />

      <ChatWindow conversationId={activeConversationId} />

      <ChatInformationSidebar conversationId={activeConversationId} />
    </div>
  );
};
