import React from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import Logout from "../../AuthArea/Logout/Logout";
const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {/* Header
      <Link to={"/update/email"}>updateEmail</Link>
      <Link to={"/update/password"}>updatePassword</Link>
      <Logout /> */}
      <span>Home</span>
      <Logout />

      <select>
        <option>Profile</option>
        <option>UpdateEmail</option>
        <option>UpdatePassword</option>
        <option>Logout</option>
      </select>
    </header>
  );
};

export default Header;
