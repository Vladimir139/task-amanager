import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/store";
import { mapAuthPayloadToAuthUser, userActions } from "@/entities/user";
import { authActions, useRegisterMutation } from "@/features/auth";
import { saveStoredAuthTokens } from "@/shared/lib/auth/authStorage";

import styles from "./RegisterPage.module.scss";

interface RegisterFormState {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleTitle: string;
}

const initialFormState: RegisterFormState = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  roleTitle: "Product Designer",
};

export const RegisterPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormState>(initialFormState);
  const [register, { error, isLoading }] = useRegisterMutation();

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
      const session = await register(form).unwrap();

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
          Register
        </Typography>
        <Typography className={styles.subtitle}>
          Fill in the fields below to create your account.
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              required
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              placeholder="First name"
              fullWidth
            />

            <TextField
              required
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              placeholder="Last name"
              fullWidth
            />
          </Stack>

          <TextField
            required
            label="Role"
            name="roleTitle"
            value={form.roleTitle}
            onChange={handleChange}
            placeholder="Your role"
            fullWidth
          />

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
            autoComplete="new-password"
            placeholder="Password"
            helperText="At least 8 characters"
            fullWidth
          />

          {error && <Alert severity="error">Unable to create account. Check the form data.</Alert>}
        </Stack>

        <Button
          type="submit"
          variant="contained"
          size="large"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <Typography className={styles.footer}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </div>
  );
};
