import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

export function Button({ variant = "primary", children, className = "", ...props }: Props) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
