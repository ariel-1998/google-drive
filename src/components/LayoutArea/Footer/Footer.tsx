import React from "react";
import styles from "./style.module.css";

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerBorder} />
      MiniDrive & Firebase V.9@2023
    </div>
  );
};

export default Footer;
