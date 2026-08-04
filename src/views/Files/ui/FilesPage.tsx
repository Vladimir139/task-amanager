import {
  Add,
  ArrowUpward,
  DescriptionOutlined,
  ExpandMore,
  Folder,
  ImageOutlined,
  InsertDriveFileOutlined,
  Link,
  MoreVert,
  MusicNoteOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import React, { type ChangeEvent, type FC, useRef } from "react";

import { activityItems, folders, recentFiles, storageItems } from "../model/files.data.ts";
import type { FileType, FolderColor, StorageItem } from "../model/files.types.ts";
import styles from "./FilesPage.module.scss";

const folderClassNames: Record<FolderColor, string> = {
  blue: styles.blueFolder,
  purple: styles.purpleFolder,
  yellow: styles.yellowFolder,
  green: styles.greenFolder,
  red: styles.redFolder,
};

const storageClassNames: Record<StorageItem["type"], string> = {
  media: styles.mediaStorage,
  documents: styles.documentsStorage,
  music: styles.musicStorage,
  other: styles.otherStorage,
};

function RecentFileIcon({ type }: { type: FileType }) {
  const icons: Record<FileType, React.ReactNode> = {
    document: <DescriptionOutlined />,
    image: <ImageOutlined />,
    figma: <span className={styles.figmaIcon}>F</span>,
    illustrator: <span className={styles.illustratorIcon}>Ai</span>,
  };

  return <Box className={`${styles.fileIcon} ${styles[`${type}FileIcon`]}`}>{icons[type]}</Box>;
}

function StorageIcon({ type }: Pick<StorageItem, "type">) {
  const icons: Record<StorageItem["type"], React.ReactNode> = {
    media: <ImageOutlined />,
    documents: <DescriptionOutlined />,
    music: <MusicNoteOutlined />,
    other: <InsertDriveFileOutlined />,
  };

  return <Box className={`${styles.storageIcon} ${storageClassNames[type]}`}>{icons[type]}</Box>;
}

export const FilesPage: FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    console.log("Uploaded files:", selectedFiles);
  };

  return (
    <main className={styles.page}>
      <Box className={styles.pageHeader}>
        <Typography component="h1">Files</Typography>

        <Box className={styles.pageActions}>
          <Button
            variant="contained"
            disableElevation
            startIcon={<Add />}
            className={styles.createFolderButton}
          >
            Create New Folder
          </Button>

          <input ref={fileInputRef} type="file" hidden multiple onChange={handleUpload} />

          <Button
            variant="outlined"
            startIcon={<Link />}
            className={styles.uploadButton}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload
          </Button>
        </Box>
      </Box>

      <Box className={styles.layout}>
        <Box className={styles.mainColumn}>
          <Paper className={styles.foldersSection} elevation={0}>
            <Box className={styles.foldersHeader}>
              <Box className={styles.foldersTitle}>
                <Box className={styles.allFilesIcon}>
                  <Folder />
                </Box>

                <IconButton>
                  <ExpandMore />
                </IconButton>

                <Typography>All Files</Typography>
              </Box>

              <button type="button" className={styles.showAllButton}>
                Show All
                <ExpandMore />
              </button>
            </Box>

            <Box className={styles.foldersGrid}>
              {folders.map((folder) => (
                <button key={folder.id} type="button" className={styles.folderCard}>
                  <Box className={styles.folderCardHeader}>
                    <Folder className={`${styles.folderIcon} ${folderClassNames[folder.color]}`} />

                    {!!folder.members?.length && (
                      <AvatarGroup max={2} className={styles.folderMembers}>
                        {folder.members.map((member) => (
                          <Avatar key={`${folder.id}-${member}`}>{member}</Avatar>
                        ))}
                      </AvatarGroup>
                    )}
                  </Box>

                  <Box className={styles.folderInformation}>
                    <Typography>{folder.name}</Typography>
                    <Typography>{folder.filesCount} files</Typography>
                  </Box>
                </button>
              ))}
            </Box>
          </Paper>

          <Paper className={styles.recentSection} elevation={0}>
            <Box className={styles.recentHeader}>
              <Typography component="h2">Recent File</Typography>

              <button type="button">View All</button>
            </Box>

            <Box className={styles.tableHeader}>
              <button type="button">
                Name
                <ArrowUpward />
              </button>

              <button type="button">
                Size
                <ArrowUpward />
              </button>

              <button type="button">
                Last Modified
                <ArrowUpward />
              </button>

              <button type="button">
                Members
                <ArrowUpward />
              </button>

              <span />
            </Box>

            <Box className={styles.filesList}>
              {recentFiles.map((file) => (
                <Box className={styles.fileRow} key={file.id}>
                  <Box className={styles.fileName}>
                    <RecentFileIcon type={file.type} />
                    <Typography>{file.name}</Typography>
                  </Box>

                  <Typography className={styles.fileSize}>{file.size}</Typography>

                  <Typography className={styles.fileModified}>{file.lastModified}</Typography>

                  <AvatarGroup max={5} className={styles.fileMembers}>
                    {file.members.map((member) => (
                      <Avatar key={`${file.id}-${member}`}>{member}</Avatar>
                    ))}
                  </AvatarGroup>

                  <IconButton className={styles.fileActions}>
                    <MoreVert />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        <aside className={styles.sideColumn}>
          <Paper className={styles.storageCard} elevation={0}>
            <Box className={styles.storageSummary}>
              <Box className={styles.progressWrapper}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  className={styles.progressBackground}
                  size={92}
                  thickness={5}
                />

                <CircularProgress
                  variant="determinate"
                  value={85}
                  className={styles.progressValue}
                  size={92}
                  thickness={5}
                />

                <Typography>85%</Typography>
              </Box>

              <Box>
                <Typography>Available Storage</Typography>
                <Typography>130GB / 512GB</Typography>
              </Box>
            </Box>

            <Box className={styles.storageList}>
              {storageItems.map((item) => (
                <Box className={styles.storageItem} key={item.id}>
                  <StorageIcon type={item.type} />

                  <Box className={styles.storageInformation}>
                    <Box>
                      <Typography>{item.title}</Typography>
                      <Typography>{item.value}</Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={item.percentage}
                      className={`${styles.storageProgress} ${storageClassNames[item.type]}`}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper className={styles.activityCard} elevation={0}>
            <Typography component="h2">Activity Chart</Typography>

            <Box className={styles.chart}>
              <Box className={styles.chartGrid}>
                <span />
                <span />
                <span />
                <span />
              </Box>

              <Box className={styles.chartBars}>
                {activityItems.map((item) => (
                  <Box
                    key={item.id}
                    className={`${styles.chartBar} ${styles[`${item.type}Bar`]}`}
                    sx={{
                      height: `${item.value}%`,
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box className={styles.chartLegend}>
              <Box>
                <span className={styles.mediaDot} />
                Media
              </Box>

              <Box>
                <span className={styles.photosDot} />
                Photos
              </Box>

              <Box>
                <span className={styles.docsDot} />
                Docs
              </Box>
            </Box>
          </Paper>
        </aside>
      </Box>
    </main>
  );
};
