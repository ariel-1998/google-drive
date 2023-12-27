import React from "react";
import styles from "./style.module.css";

type ButtonProps = {
  className?: string;
  theme?: "primary" | "secondary" | "danger" | "authPrimary";
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button: React.FC<ButtonProps> = ({ className, theme, ...rest }) => {
  const inputStyle =
    (theme === "primary" && styles.primary) ||
    (theme === "secondary" && styles.secondary) ||
    (theme === "danger" && styles.danger) ||
    (theme === "danger" && styles.authPrimary);
  return (
    <button
      className={`${inputStyle} ${styles.button} ${className}`}
      {...rest}
    />
  );
};

export default Button;
