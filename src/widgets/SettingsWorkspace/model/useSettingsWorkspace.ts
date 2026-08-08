import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  mapUserRecordToAuthUser,
  mapUserRecordToProfile,
  useGetCurrentUserQuery,
  userActions,
  type UserProfile,
  type UserProfileField,
  useUpdateCurrentUserMutation,
  useUploadAvatarMutation,
} from "@/entities/user";
import { useAppDispatch } from "@/shared/libs/redux";
import type { SettingsTab } from "@/widgets/SettingsNavigation/model/types";

interface UseSettingsWorkspaceResult {
  activeTab: SettingsTab;
  avatarPreview: string;
  handleAvatarChange: (file: File) => void;
  handleCancel: () => void;
  handleFieldChange: (field: UserProfileField) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => Promise<void>;
  handleTabChange: (tab: SettingsTab) => void;
  isLoading: boolean;
  isSaving: boolean;
  profile: UserProfile;
}

const emptyProfile: UserProfile = {
  avatar: "",
  email: "",
  firstName: "",
  lastName: "",
  role: "",
};

export const useSettingsWorkspace = (): UseSettingsWorkspaceResult => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SettingsTab>("My details");
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const [updateCurrentUser, { isLoading: isUpdatingProfile }] = useUpdateCurrentUserMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();

  useEffect(() => {
    if (!user) {
      return;
    }

    const nextProfile = mapUserRecordToProfile(user);
    setProfile(nextProfile);
    setAvatarPreview(nextProfile.avatar);
    setAvatarFile(null);
  }, [user]);

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
    setAvatarPreview(nextProfile.avatar);
    setAvatarFile(null);
  };

  const handleCancel = () => {
    resetFromUser();
  };

  const handleSave = async () => {
    let latestUser = user;

    if (avatarFile) {
      latestUser = await uploadAvatar(avatarFile).unwrap();
    }

    const updatedUser = await updateCurrentUser({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      roleTitle: profile.role,
    }).unwrap();

    dispatch(userActions.setAuthData(mapUserRecordToAuthUser(updatedUser)));
    const nextProfile = mapUserRecordToProfile(updatedUser);
    setProfile(nextProfile);
    setAvatarPreview(latestUser?.avatarUrl ?? nextProfile.avatar);
    setAvatarFile(null);
  };

  return {
    activeTab,
    avatarPreview,
    handleAvatarChange,
    handleCancel,
    handleFieldChange,
    handleSave,
    handleTabChange,
    isLoading,
    isSaving: isUpdatingProfile || isUploadingAvatar,
    profile,
  };
};
