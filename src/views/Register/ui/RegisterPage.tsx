import { Button, Stack, TextField, Typography } from "@mui/material";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { setSession, useAppDispatch } from "@/app/store";

import styles from "./RegisterPage.module.scss";

interface RegisterFormState {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const initialFormState: RegisterFormState = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
};

export const RegisterPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormState>(initialFormState);

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
          firstName: form.firstName,
          lastName: form.lastName,
        },
      }),
    );

    void navigate("/dashboard", { replace: true });
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
            fullWidth
          />
        </Stack>

        <Button type="submit" variant="contained" size="large" className={styles.submitButton}>
          Register
        </Button>
      </form>

      <Typography className={styles.footer}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </div>
  );
};
