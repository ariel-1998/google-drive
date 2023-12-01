import React from "react";
import styles from "./style.module.css";
import { Outlet } from "react-router-dom";
import Footer from "../../LayoutArea/Footer/Footer";

const UnauthLayoutContainer: React.FC = () => {
  return (
    <div className={styles.layout}>
      {/* <Header /> */}
      <div> Header </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default UnauthLayoutContainer;
