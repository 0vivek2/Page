"use client";

import LandingPage from "./landingpage/landingpage";
import styles from "./landingpage/page.module.css";

export default function Page() {
  return (
    <div className={styles.pageWrapper}>
      <LandingPage />
    </div>
  );
}