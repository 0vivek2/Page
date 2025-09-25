"use client";

import LandingPage from "./landingpage";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.pageWrapper}>
      <LandingPage />
    </div>
  );
}
