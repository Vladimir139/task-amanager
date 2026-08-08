import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { ChangeEvent, FC } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { projectColorOptions, projectStatusOptions } from "@/entities/project";
import { getProjectsRoute } from "@/shared/config/router";

import { type CreateProjectPayload, useCreateProjectMutation } from "../../api/createProjectApi";

interface CreateProjectButtonProps {
  className?: string;
}

const toIsoDate = (value?: string): string | undefined =>
  value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;

export const CreateProjectButton: FC<CreateProjectButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<CreateProjectPayload>({
    color: "blue",
    description: "",
    dueDate: "",
    startDate: "",
    status: "active",
    title: "",
  });

  const isSubmitDisabled = useMemo(() => !form.title.trim(), [form.title]);

  const handleOpen = (): void => {
    setIsOpen(true);
  };

  const handleClose = (): void => {
    if (isLoading) {
      return;
    }

    setIsOpen(false);
    resetForm();
  };

  const handleChange =
    (field: keyof CreateProjectPayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const resetForm = (): void => {
    setForm({
      color: "blue",
      description: "",
      dueDate: "",
      startDate: "",
      status: "active",
      title: "",
    });
  };

  const handleCreateProject = async (): Promise<void> => {
    const createdProject = await createProject({
      ...form,
      dueDate: toIsoDate(form.dueDate),
      startDate: toIsoDate(form.startDate),
      title: form.title.trim(),
    }).unwrap();

    resetForm();
    setIsOpen(false);
    await navigate(getProjectsRoute(createdProject._id));
  };

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        startIcon={<Add />}
        className={className}
        onClick={handleOpen}
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "New Project"}
      </Button>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create project</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={handleChange("title")}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={form.description ?? ""}
              onChange={handleChange("description")}
              multiline
              minRows={3}
              fullWidth
            />

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: "repeat(2, minmax(0, 1fr))",
                  xs: "1fr",
                },
              }}
            >
              <TextField
                select
                label="Status"
                value={form.status ?? "active"}
                onChange={handleChange("status")}
                fullWidth
              >
                {projectStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Color"
                value={form.color ?? "blue"}
                onChange={handleChange("color")}
                fullWidth
              >
                {projectColorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  sm: "repeat(2, minmax(0, 1fr))",
                  xs: "1fr",
                },
              }}
            >
              <TextField
                label="Start date"
                type="date"
                value={form.startDate ?? ""}
                onChange={handleChange("startDate")}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />

              <TextField
                label="Due date"
                type="date"
                value={form.dueDate ?? ""}
                onChange={handleChange("dueDate")}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              void handleCreateProject();
            }}
            disabled={isLoading || isSubmitDisabled}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
