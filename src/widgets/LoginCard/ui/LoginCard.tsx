import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { Link } from "react-router-dom";

import { LoginForm } from "@/features/auth/ui/LoginForm/LoginForm";
import { ROUTES } from "@/shared/config/router";

export const LoginCard: FC = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h5">Login</Typography>
        <Typography color="text.secondary">Enter your email and password to continue.</Typography>
      </Box>

      <LoginForm />

      <Typography>
        Don&apos;t have an account? <Link to={ROUTES.auth.register.page}>Register</Link>
      </Typography>
    </Box>
  );
};
