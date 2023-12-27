import React from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import HeaderBtn from "../HeaderBtn/HeaderBtn";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div>
        <Link to={"/welcome"} className={styles.title}>
          <span>MiniDrive</span>
        </Link>
      </div>
      <div className={styles.headerBtns}>
        <HeaderBtn path="signup" />
        <HeaderBtn path="login" />
      </div>
    </header>
  );
};

export default Header;
