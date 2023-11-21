import React from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <div>
      Header
      <Link to={"/update/email"}>updateEmail</Link>
    </div>
  );
};

export default Header;
