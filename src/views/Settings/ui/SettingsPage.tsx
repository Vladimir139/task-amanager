import { CloudUploadOutlined, EmailOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { type ChangeEvent, type FC, useRef, useState } from "react";

import styles from "./SettingsPage.module.scss";

const settingsTabs = [
  "My details",
  "Profile",
  "Password",
  "Team",
  "Plan",
  "Billing",
  "Email",
  "Notifications",
] as const;

type SettingsTab = (typeof settingsTabs)[number];

interface SettingsForm {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const initialForm: SettingsForm = {
  firstName: "Killan",
  lastName: "James",
  email: "killanjames@gmail.com",
  role: "Product Designer",
};

export const SettingsPage: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<SettingsTab>("My details");
  const [form, setForm] = useState<SettingsForm>(initialForm);
  const [avatarPreview, setAvatarPreview] = useState("/images/user-avatar.jpg");

  const handleFieldChange =
    (field: keyof SettingsForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleCancel = () => {
    setForm(initialForm);
  };

  const handleSave = () => {
    console.log("Settings saved:", form);
  };

  return (
    <div className={styles.content}>
      <section className={styles.profileHeader}>
        <Box component="img" src="/images/settings-cover.jpg" alt="" className={styles.cover} />

        <Box className={styles.profileInformation}>
          <Box className={styles.userBlock}>
            <Avatar
              src={avatarPreview}
              alt={`${form.firstName} ${form.lastName}`}
              className={styles.avatar}
            />

            <Typography component="h1">Settings</Typography>
          </Box>

          <Box className={styles.headerActions}>
            <Button variant="outlined" className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </Button>

            <Button
              variant="contained"
              disableElevation
              className={styles.saveButton}
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Box>
      </section>

      <nav className={styles.tabs} aria-label="Settings sections">
        {settingsTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? styles.activeTab : ""}
            onClick={() => {
              setActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className={styles.formSection}>
        <Box className={styles.nameFields}>
          <Box className={styles.field}>
            <Typography component="label" htmlFor="first-name">
              First name
            </Typography>

            <TextField
              id="first-name"
              fullWidth
              value={form.firstName}
              onChange={handleFieldChange("firstName")}
            />
          </Box>

          <Box className={styles.field}>
            <Typography component="label" htmlFor="last-name">
              Last name
            </Typography>

            <TextField
              id="last-name"
              fullWidth
              value={form.lastName}
              onChange={handleFieldChange("lastName")}
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
            fullWidth
            value={form.email}
            onChange={handleFieldChange("email")}
            slotProps={{
              input: {
                startAdornment: <EmailOutlined className={styles.inputIcon} />,
              },
            }}
          />
        </Box>

        <Box className={styles.sectionDivider} />

        <Box className={styles.uploadField}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.gif"
            hidden
            onChange={handleFileChange}
          />

          <button
            type="button"
            className={styles.uploadArea}
            onClick={() => fileInputRef.current?.click()}
          >
            <Box className={styles.uploadIcon}>
              <CloudUploadOutlined />
            </Box>

            <Typography>Click to upload or drag and drop</Typography>

            <Typography>SVG, PNG, JPG or GIF (max. 800x400px)</Typography>
          </button>
        </Box>

        <Box className={styles.field}>
          <Typography component="label" htmlFor="role">
            Role
          </Typography>

          <TextField
            id="role"
            select
            fullWidth
            value={form.role}
            onChange={handleFieldChange("role")}
          >
            <MenuItem value="Product Designer">Product Designer</MenuItem>

            <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>

            <MenuItem value="Backend Developer">Backend Developer</MenuItem>

            <MenuItem value="Project Manager">Project Manager</MenuItem>
          </TextField>
        </Box>
      </section>
    </div>
  );
};
