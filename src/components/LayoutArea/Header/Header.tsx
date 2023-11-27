import React from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import Logout from "../../AuthArea/Logout/Logout";
import HeaderProfile from "../HeaderProfile/HeaderProfile";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link to={"/"} className={styles.title}>
        <span>MiniDrive</span>
      </Link>
      <HeaderProfile />
    </header>
  );
};

export default Header;
