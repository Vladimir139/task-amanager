import type { FC } from "react";

import { useSettingsPage } from "@/views/Settings/model/useSettingsPage.ts";
import { ProfileDetailsForm, SettingsNavigation, SettingsProfileHeader } from "@/widgets";

import styles from "./SettingsPage.module.scss";

export const SettingsPage: FC = () => {
  const {
    activeTab,
    profile,
    avatarPreview,
    handleTabChange,
    handleFieldChange,
    handleAvatarChange,
    handleCancel,
    handleSave,
  } = useSettingsPage();

  return (
    <main className={styles.content}>
      <SettingsProfileHeader
        firstName={profile.firstName}
        lastName={profile.lastName}
        avatar={avatarPreview}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      <SettingsNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "My details" && (
        <ProfileDetailsForm
          profile={profile}
          onFieldChange={handleFieldChange}
          onAvatarChange={handleAvatarChange}
        />
      )}

      {activeTab !== "My details" && (
        <section className={styles.emptySection}>
          This section has not been implemented yet.
        </section>
      )}
    </main>
  );
};
