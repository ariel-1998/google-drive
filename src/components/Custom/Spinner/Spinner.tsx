import React, { CSSProperties } from "react";
import styles from "./style.module.css";

// type SpinnerProps = { style?: CSSProperties };

const Spinner: React.FC = () => {
  return <div className={styles.spinner} />;
};

export default Spinner;
