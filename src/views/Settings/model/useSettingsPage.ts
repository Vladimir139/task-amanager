import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

import type { UserProfile, UserProfileField } from "@/entities/user";
import type { SettingsTab } from "@/widgets";

import { initialUserProfile } from "./constants";

interface UseSettingsPageResult {
  activeTab: SettingsTab;
  profile: UserProfile;
  avatarPreview: string;
  handleTabChange: (tab: SettingsTab) => void;
  handleFieldChange: (field: UserProfileField) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleAvatarChange: (file: File) => void;
  handleCancel: () => void;
  handleSave: () => void;
}

export const useSettingsPage = (): UseSettingsPageResult => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("My details");

  const [profile, setProfile] = useState<UserProfile>(initialUserProfile);

  const [avatarPreview, setAvatarPreview] = useState(initialUserProfile.avatar);

  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
  };

  const handleFieldChange = (field: UserProfileField) => (event: ChangeEvent<HTMLInputElement>) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: event.target.value,
    }));
  };

  const handleAvatarChange = (file: File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);

    objectUrlRef.current = previewUrl;
    setAvatarPreview(previewUrl);
  };

  const handleCancel = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setProfile(initialUserProfile);
    setAvatarPreview(initialUserProfile.avatar);
  };

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      avatar: avatarPreview,
    };

    console.log("Settings saved:", updatedProfile);
  };

  return {
    activeTab,
    profile,
    avatarPreview,
    handleTabChange,
    handleFieldChange,
    handleAvatarChange,
    handleCancel,
    handleSave,
  };
};
