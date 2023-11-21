import React, { CSSProperties } from "react";
import styles from "./style.module.css";

type SpinnerProps = { style?: CSSProperties };

const Spinner: React.FC<SpinnerProps> = ({ style }) => {
  return <div className={styles.spinner} style={style} />;
};

export default Spinner;
