import { Typography } from "@mui/material";
import type { FC } from "react";

import { ProfileDetailsForm } from "@/widgets/ProfileDetailsForm";
import { SettingsNavigation } from "@/widgets/SettingsNavigation";
import { SettingsProfileHeader } from "@/widgets/SettingsProfileHeader";

import { useSettingsWorkspace } from "../model/useSettingsWorkspace";
import styles from "./SettingsWorkspace.module.scss";

export const SettingsWorkspace: FC = () => {
  const {
    activeTab,
    profile,
    avatarPreview,
    handleTabChange,
    handleFieldChange,
    handleAvatarChange,
    handleCancel,
    handleSave,
    isLoading,
    isSaving,
  } = useSettingsWorkspace();

  if (isLoading) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <main className={styles.content}>
      <SettingsProfileHeader
        firstName={profile.firstName}
        lastName={profile.lastName}
        avatar={avatarPreview}
        onCancel={handleCancel}
        onSave={() => {
          void handleSave();
        }}
        isSaving={isSaving}
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
