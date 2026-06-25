import { ReactNode } from "react";

type Props = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Card({ title, action, children, className = "" }: Props) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          {title && <h2>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
