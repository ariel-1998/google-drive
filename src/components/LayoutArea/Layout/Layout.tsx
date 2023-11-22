import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./style.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Folder from "../../FolderArea/Folder/Folder";
import { FolderModel } from "../../../models/FolderModel";

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
