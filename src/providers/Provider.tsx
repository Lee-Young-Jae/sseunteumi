import { ReactNode } from "react";
import TanStackProvider from "./TQProvider";

const Provider = ({ children }: { children: ReactNode }) => {
  return <TanStackProvider>{children}</TanStackProvider>;
};

export default Provider;
