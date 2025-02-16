"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LayoutStyle from "./component/LayoutStyle";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  return <LayoutStyle>{children}</LayoutStyle>;
};

export default Layout;
