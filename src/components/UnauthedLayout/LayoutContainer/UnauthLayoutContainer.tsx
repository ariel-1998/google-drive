import React from "react";
import styles from "./style.module.css";
import { Outlet } from "react-router-dom";

const UnauthLayoutContainer: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Outlet />
    </div>
  );
};

export default UnauthLayoutContainer;
