import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { Link } from "react-router-dom";

import { RegisterForm } from "@/features/auth/ui/RegisterForm/RegisterForm";
import { ROUTES } from "@/shared/config/router";

export const RegisterCard: FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h5">Register</Typography>
        <Typography color="text.secondary">
          Fill in the fields below to create your account.
        </Typography>
      </Box>

      <RegisterForm />

      <Typography>
        Already have an account? <Link to={ROUTES.auth.login.page}>Login</Link>
      </Typography>
    </Box>
  );
};
