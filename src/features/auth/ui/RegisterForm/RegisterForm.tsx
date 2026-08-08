import { Alert, Button, Stack, TextField } from "@mui/material";
import type { ChangeEvent, FC, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/router";
import { useAppDispatch } from "@/shared/libs/redux";

import { useRegisterMutation } from "../../api/authApi";
import { applyAuthSession } from "../../lib/session";
import type { RegisterFormState } from "../../model/types/forms";

const initialFormState: RegisterFormState = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  roleTitle: "Product Designer",
};

export const RegisterForm: FC = () => {
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

      applyAuthSession(dispatch, session);

      await navigate(ROUTES.dashboard.page, { replace: true });
    } catch {
      // handled by RTK Query error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

        <Button type="submit" variant="contained" size="large" disabled={isLoading} fullWidth>
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </Stack>
    </form>
  );
};
