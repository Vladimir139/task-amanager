import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/store";
import { mapAuthPayloadToAuthUser, userActions } from "@/entities/user";
import { authActions, useLoginMutation } from "@/features/auth";
import { saveStoredAuthTokens } from "@/shared/lib/auth/authStorage";

import styles from "./LoginPage.module.scss";

interface LoginFormState {
  email: string;
  password: string;
}

const initialFormState: LoginFormState = {
  email: "",
  password: "",
};

export const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormState>(initialFormState);
  const [login, { error, isLoading }] = useLoginMutation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      const session = await login(form).unwrap();

      dispatch(
        authActions.setTokens({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        }),
      );
      dispatch(userActions.setAuthData(mapAuthPayloadToAuthUser(session.user)));
      dispatch(authActions.setInitialized(true));
      saveStoredAuthTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });

      await navigate("/dashboard", { replace: true });
    } catch {
      // handled by RTK Query error state
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.heading}>
        <Typography variant="h5" className={styles.title}>
          Login
        </Typography>
        <Typography className={styles.subtitle}>
          Enter your email and password to continue.
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Stack spacing={2.5}>
          <TextField
            required
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="Email"
            fullWidth
          />

          <TextField
            required
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="Password"
            fullWidth
          />

          {error && <Alert severity="error">Unable to sign in. Check your credentials.</Alert>}
        </Stack>

        <Button
          type="submit"
          variant="contained"
          size="large"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Login"}
        </Button>
      </form>

      <Typography className={styles.footer}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </Typography>
    </div>
  );
};
