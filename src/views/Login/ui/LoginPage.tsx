import { Button, Stack, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { setSession, useAppDispatch } from "@/app/store";

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    dispatch(
      setSession({
        accessToken: "frontend-demo-access-token",
        refreshToken: "frontend-demo-refresh-token",
        user: {
          email: form.email,
          firstName: "Demo",
          lastName: "User",
        },
      }),
    );

    void navigate("/dashboard", { replace: true });
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
        </Stack>

        <Button type="submit" variant="contained" size="large" className={styles.submitButton}>
          Login
        </Button>
      </form>

      <Typography className={styles.footer}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </Typography>
    </div>
  );
};
