import React from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import Logout from "../../AuthArea/Logout/Logout";

const Header: React.FC = () => {
  return (
    <div>
      Header
      <Link to={"/update/email"}>updateEmail</Link>
      <Link to={"/update/password"}>updatePassword</Link>
      <Logout />
    </div>
  );
};

export default Header;
