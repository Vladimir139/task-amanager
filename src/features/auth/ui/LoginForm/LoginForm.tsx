import { Alert, Button, Stack, TextField } from "@mui/material";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/router";
import { useAppDispatch } from "@/shared/libs/redux";

import { useLoginMutation } from "../../api/authApi";
import { applyAuthSession } from "../../lib/session";
import type { LoginFormState } from "../../model/types/forms";

const initialFormState: LoginFormState = {
  email: "",
  password: "",
};

export const LoginForm: FC = () => {
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

      applyAuthSession(dispatch, session);

      await navigate(ROUTES.dashboard.page, { replace: true });
    } catch {
      // handled by RTK Query error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

        <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
          {isLoading ? "Signing in..." : "Login"}
        </Button>
      </Stack>
    </form>
  );
};
