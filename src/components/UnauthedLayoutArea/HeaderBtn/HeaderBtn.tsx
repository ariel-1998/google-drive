import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Custom/Button/Button";

type HeaderBtnProps = {
  path: "login" | "signup";
};

const HeaderBtn: React.FC<HeaderBtnProps> = ({ path }) => {
  const navigate = useNavigate();
  const redirect = `/auth/${path}`;
  return (
    <Button onClick={() => navigate(redirect)}>
      {path === "login" ? "Login" : "Register"}
    </Button>
  );
};

export default HeaderBtn;
