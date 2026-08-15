import { EmailOutlined } from "@mui/icons-material";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import type { ChangeEventHandler, FC } from "react";

import type { UserProfile, UserProfileField } from "@/entities/user";
import { UploadProfileAvatar } from "@/features/uploadProfileAvatar";

import styles from "./ProfileDetailsForm.module.scss";

interface ProfileDetailsFormProps {
  avatarPreview: string;
  profile: UserProfile;
  onFieldChange: (field: UserProfileField) => ChangeEventHandler<HTMLInputElement>;
  onAvatarChange: (file: File) => void;
  selectedAvatarFileName?: string | null;
}

export const ProfileDetailsForm: FC<ProfileDetailsFormProps> = ({
  avatarPreview,
  profile,
  onFieldChange,
  onAvatarChange,
  selectedAvatarFileName = null,
}) => {
  return (
    <section className={styles.formSection}>
      <Box className={styles.nameFields}>
        <Box className={styles.field}>
          <Typography component="label" htmlFor="first-name">
            First name
          </Typography>

          <TextField
            id="first-name"
            fullWidth
            value={profile.firstName}
            onChange={onFieldChange("firstName")}
          />
        </Box>

        <Box className={styles.field}>
          <Typography component="label" htmlFor="last-name">
            Last name
          </Typography>

          <TextField
            id="last-name"
            fullWidth
            value={profile.lastName}
            onChange={onFieldChange("lastName")}
          />
        </Box>
      </Box>

      <Box className={styles.sectionDivider} />

      <Box className={styles.field}>
        <Typography component="label" htmlFor="email">
          Email
        </Typography>

        <TextField
          id="email"
          type="email"
          fullWidth
          value={profile.email}
          onChange={onFieldChange("email")}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined className={styles.inputIcon} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box className={styles.sectionDivider} />

      <UploadProfileAvatar
        onFileSelect={onAvatarChange}
        previewUrl={avatarPreview}
        selectedFileName={selectedAvatarFileName}
      />

      <Box className={styles.field}>
        <Typography component="label" htmlFor="role">
          Role
        </Typography>

        <TextField id="role" fullWidth value={profile.role} onChange={onFieldChange("role")} />
      </Box>
    </section>
  );
};
