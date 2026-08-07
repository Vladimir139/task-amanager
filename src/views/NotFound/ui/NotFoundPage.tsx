import { Button, Stack, Typography } from "@mui/material";
import type { FC } from "react";
import { Link } from "react-router-dom";

import styles from "./NotFoundPage.module.scss";

export const NotFoundPage: FC = () => {
  return (
    <Stack className={styles.page} spacing={3}>
      <Typography variant="overline" className={styles.label}>
        404
      </Typography>
      <Typography variant="h3" className={styles.title}>
        Page not found
      </Typography>
      <Typography className={styles.description}>
        The route exists in neither the current frontend flow nor the planned backend integration.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button component={Link} to="/dashboard" variant="contained">
          Open dashboard
        </Button>
        <Button component={Link} to="/login" variant="outlined">
          Go to login
        </Button>
      </Stack>
    </Stack>
  );
};
