import { Alert, Typography } from "@mui/material";
import type { FC } from "react";

import { NotificationSettingsForm } from "@/widgets/NotificationSettingsForm";
import { PasswordSettingsForm } from "@/widgets/PasswordSettingsForm";
import { ProfileDetailsForm } from "@/widgets/ProfileDetailsForm";
import { ProfilePreferencesForm } from "@/widgets/ProfilePreferencesForm";
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
    handleNotificationChange,
    handlePasswordFieldChange,
    handleSave,
    isLoadError,
    isLoading,
    isSaving,
    isSaveDisabled,
    notificationSettings,
    passwordForm,
    statusMessage,
    statusTone,
  } = useSettingsWorkspace();

  if (isLoading) {
    return <Typography>Loading profile...</Typography>;
  }

  if (isLoadError) {
    return <Typography>Unable to load profile settings.</Typography>;
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
        isSaveDisabled={isSaveDisabled}
      />

      <SettingsNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {statusMessage && statusTone && (
        <Alert severity={statusTone} className={styles.statusAlert}>
          {statusMessage}
        </Alert>
      )}

      {activeTab === "My details" && (
        <ProfileDetailsForm
          profile={profile}
          onFieldChange={handleFieldChange}
          onAvatarChange={handleAvatarChange}
        />
      )}

      {activeTab === "Profile" && (
        <ProfilePreferencesForm profile={profile} onFieldChange={handleFieldChange} />
      )}

      {activeTab === "Password" && (
        <PasswordSettingsForm
          passwordForm={passwordForm}
          onFieldChange={handlePasswordFieldChange}
        />
      )}

      {activeTab === "Notifications" && (
        <NotificationSettingsForm
          notificationSettings={notificationSettings}
          onFieldChange={handleNotificationChange}
        />
      )}

      {["My details", "Notifications", "Password", "Profile"].includes(activeTab) === false && (
        <section className={styles.emptySection}>
          This section has not been implemented yet.
        </section>
      )}
    </main>
  );
};
