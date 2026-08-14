import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  defaultNotificationSettings,
  mapUserRecordToAuthUser,
  mapUserRecordToNotificationSettings,
  mapUserRecordToProfile,
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  userActions,
  type UserNotificationField,
  type UserNotificationSettings,
  type UserPasswordField,
  type UserPasswordForm,
  type UserProfile,
  type UserProfileField,
  useUpdateCurrentUserMutation,
  useUpdateNotificationSettingsMutation,
  useUploadAvatarMutation,
} from "@/entities/user";
import { useAppDispatch } from "@/shared/libs/redux";
import { type SettingsTab, settingsTabs } from "@/widgets/SettingsNavigation/model/types";

interface UseSettingsWorkspaceResult {
  activeTab: SettingsTab;
  avatarPreview: string;
  handleAvatarChange: (file: File) => void;
  handleCancel: () => void;
  handleFieldChange: (field: UserProfileField) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleNotificationChange: (
    field: UserNotificationField,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordFieldChange: (
    field: UserPasswordField,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => Promise<void>;
  handleTabChange: (tab: SettingsTab) => void;
  isLoadError: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  notificationSettings: UserNotificationSettings;
  passwordForm: UserPasswordForm;
  profile: UserProfile;
  statusMessage: string | null;
  statusTone: "error" | "success" | null;
}

const emptyProfile: UserProfile = {
  avatar: "",
  email: "",
  firstName: "",
  lastName: "",
  role: "",
  timezone: "",
  locale: "en",
};

const emptyPasswordForm: UserPasswordForm = {
  confirmPassword: "",
  currentPassword: "",
  newPassword: "",
};

const implementedTabs: SettingsTab[] = ["My details", "Notifications", "Password", "Profile"];

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return fallback;
  }

  const data = error.data as { message?: string | string[] };
  if (Array.isArray(data.message)) {
    return data.message[0] ?? fallback;
  }

  return data.message ?? fallback;
};

export const useSettingsWorkspace = (): UseSettingsWorkspaceResult => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialActiveTab =
    requestedTab && settingsTabs.includes(requestedTab as SettingsTab)
      ? (requestedTab as SettingsTab)
      : "My details";
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialActiveTab);
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [notificationSettings, setNotificationSettings] = useState<UserNotificationSettings>(
    defaultNotificationSettings,
  );
  const [passwordForm, setPasswordForm] = useState<UserPasswordForm>(emptyPasswordForm);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const { data: user, isError: isLoadError, isLoading } = useGetCurrentUserQuery();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [updateCurrentUser, { isLoading: isUpdatingProfile }] = useUpdateCurrentUserMutation();
  const [updateNotificationSettings, { isLoading: isUpdatingNotifications }] =
    useUpdateNotificationSettingsMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();

  useEffect(() => {
    if (!user) {
      return;
    }

    const nextProfile = mapUserRecordToProfile(user);
    setProfile(nextProfile);
    setNotificationSettings(mapUserRecordToNotificationSettings(user));
    setPasswordForm(emptyPasswordForm);
    setAvatarPreview(nextProfile.avatar);
    setAvatarFile(null);
    setStatusMessage(null);
    setStatusTone(null);
  }, [user]);

  useEffect(() => {
    if (!requestedTab) {
      setActiveTab("My details");
      return;
    }

    if (settingsTabs.includes(requestedTab as SettingsTab)) {
      setActiveTab(requestedTab as SettingsTab);
      return;
    }

    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set("tab", "My details");
        return nextParams;
      },
      { replace: true },
    );
  }, [requestedTab, setSearchParams]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set("tab", tab);
      return nextParams;
    });
    setStatusMessage(null);
    setStatusTone(null);
  };

  const handleFieldChange = (field: UserProfileField) => (event: ChangeEvent<HTMLInputElement>) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: event.target.value,
    }));
  };

  const handleNotificationChange =
    (field: UserNotificationField) => (event: ChangeEvent<HTMLInputElement>) => {
      setNotificationSettings((currentSettings) => ({
        ...currentSettings,
        [field]: event.target.checked,
      }));
    };

  const handlePasswordFieldChange =
    (field: UserPasswordField) => (event: ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((currentPasswordForm) => ({
        ...currentPasswordForm,
        [field]: event.target.value,
      }));
    };

  const handleAvatarChange = (file: File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);

    objectUrlRef.current = previewUrl;
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  };

  const resetFromUser = () => {
    if (!user) {
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const nextProfile = mapUserRecordToProfile(user);
    setProfile(nextProfile);
    setNotificationSettings(mapUserRecordToNotificationSettings(user));
    setPasswordForm(emptyPasswordForm);
    setAvatarPreview(nextProfile.avatar);
    setAvatarFile(null);
    setStatusMessage(null);
    setStatusTone(null);
  };

  const handleCancel = () => {
    resetFromUser();
  };

  const handleSave = async () => {
    setStatusMessage(null);
    setStatusTone(null);

    try {
      if (activeTab === "Password") {
        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
          setStatusMessage("Fill in the current and new password fields.");
          setStatusTone("error");
          return;
        }

        if (passwordForm.newPassword.length < 8) {
          setStatusMessage("New password must be at least 8 characters long.");
          setStatusTone("error");
          return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          setStatusMessage("Password confirmation does not match.");
          setStatusTone("error");
          return;
        }

        await changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }).unwrap();

        setPasswordForm(emptyPasswordForm);
        setStatusMessage("Password updated successfully.");
        setStatusTone("success");
        return;
      }

      if (activeTab === "Notifications") {
        const updatedUser = await updateNotificationSettings(notificationSettings).unwrap();
        setNotificationSettings(mapUserRecordToNotificationSettings(updatedUser));
        dispatch(userActions.setAuthData(mapUserRecordToAuthUser(updatedUser)));
        setStatusMessage("Notification settings updated.");
        setStatusTone("success");
        return;
      }

      if (!implementedTabs.includes(activeTab)) {
        return;
      }

      if (avatarFile) {
        await uploadAvatar(avatarFile).unwrap();
      }

      const updatedUser = await updateCurrentUser({
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        locale: profile.locale,
        roleTitle: profile.role,
        timezone: profile.timezone,
      }).unwrap();

      dispatch(userActions.setAuthData(mapUserRecordToAuthUser(updatedUser)));
      const nextProfile = mapUserRecordToProfile(updatedUser);
      setProfile(nextProfile);
      setAvatarPreview(nextProfile.avatar);
      setAvatarFile(null);
      setStatusMessage("Profile settings saved.");
      setStatusTone("success");
    } catch (error) {
      const fallbackMessage =
        activeTab === "Password"
          ? "Unable to update the password."
          : activeTab === "Notifications"
            ? "Unable to update notification settings."
            : "Unable to save profile settings.";

      setStatusMessage(getErrorMessage(error, fallbackMessage));
      setStatusTone("error");
    }
  };

  return {
    activeTab,
    avatarPreview,
    handleAvatarChange,
    handleCancel,
    handleFieldChange,
    handleNotificationChange,
    handlePasswordFieldChange,
    handleSave,
    handleTabChange,
    isLoadError,
    isLoading,
    isSaving:
      isChangingPassword || isUpdatingNotifications || isUpdatingProfile || isUploadingAvatar,
    isSaveDisabled: !implementedTabs.includes(activeTab),
    notificationSettings,
    passwordForm,
    profile,
    statusMessage,
    statusTone,
  };
};
