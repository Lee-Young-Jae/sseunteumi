import { ReactNode } from "react";
import TanStackProvider from "./TQProvider";
import AuthProvider from "./AuthProvider";

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <TanStackProvider>
      <AuthProvider>{children}</AuthProvider>
    </TanStackProvider>
  );
};

export default Provider;
