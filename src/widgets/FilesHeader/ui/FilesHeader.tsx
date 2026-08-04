import { Add, Link } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useRef } from "react";

import styles from "./FilesHeader.module.scss";

export const FilesHeader: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateFolder = () => {
    console.log("Create folder");
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    console.log("Uploaded files:", selectedFiles);

    event.target.value = "";
  };

  return (
    <Box className={styles.pageHeader}>
      <Typography component="h1">Files</Typography>

      <Box className={styles.pageActions}>
        <Button
          variant="contained"
          disableElevation
          startIcon={<Add />}
          className={styles.createFolderButton}
          onClick={handleCreateFolder}
        >
          Create New Folder
        </Button>

        <input ref={fileInputRef} type="file" hidden multiple onChange={handleUpload} />

        <Button
          variant="outlined"
          startIcon={<Link />}
          className={styles.uploadButton}
          onClick={handleUploadButtonClick}
        >
          Upload
        </Button>
      </Box>
    </Box>
  );
};
