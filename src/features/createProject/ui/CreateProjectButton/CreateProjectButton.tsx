import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import type { FC } from "react";

import { useCreateProjectMutation } from "../../api/createProjectApi";

interface CreateProjectButtonProps {
  className?: string;
}

export const CreateProjectButton: FC<CreateProjectButtonProps> = ({ className }) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleCreateProject = async (): Promise<void> => {
    const title = window.prompt("Project title");

    if (!title?.trim()) {
      return;
    }

    const description = window.prompt("Project description") ?? "";

    await createProject({
      color: "blue",
      description,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      title: title.trim(),
    }).unwrap();
  };

  return (
    <Button
      variant="contained"
      disableElevation
      startIcon={<Add />}
      className={className}
      onClick={() => {
        void handleCreateProject();
      }}
      disabled={isLoading}
    >
      {isLoading ? "Creating..." : "New Project"}
    </Button>
  );
};
