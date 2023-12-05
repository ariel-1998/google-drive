import React from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div>
        <Link to={"/welcome"} className={styles.title}>
          <span>MiniDrive</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
