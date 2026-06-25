import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <TopBar />
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
