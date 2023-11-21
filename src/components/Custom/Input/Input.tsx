import React, { forwardRef } from "react";
import styles from "./style.module.css";

type InputProps = {
  className?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { className, ...rest },
  ref
) => {
  return (
    <input ref={ref} className={`${styles.input} ${className}`} {...rest} />
  );
};

export default forwardRef(Input);
