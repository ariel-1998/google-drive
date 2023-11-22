import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./style.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
