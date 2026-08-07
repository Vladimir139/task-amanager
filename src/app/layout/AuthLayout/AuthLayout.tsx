import type { FC } from "react";
import { Link, Outlet } from "react-router-dom";

import styles from "./AuthLayout.module.scss";

export const AuthLayout: FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.brand}>
          <img src="/images/octom-logo.png" alt="octom logo" className={styles.logo} />

          <div className={styles.brandCopy}>
            <span className={styles.overline}>Task manager</span>
            <h1>Welcome to Octom</h1>
            <p>Simple auth screens for the first backend integration step.</p>
          </div>
        </div>

        <div className={styles.card}>
          <Outlet />
        </div>

        <nav className={styles.links}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Open demo workspace</Link>
        </nav>
      </section>
    </div>
  );
};
