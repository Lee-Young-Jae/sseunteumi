"use client";

import { usePathname } from "next/navigation";
import LayoutStyle from "./component/LayoutStyle";
import { routeOption } from "./util/routeOption";
import Header from "./component/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const currentTitle =
    routeOption.find((route) => route.path === pathname)?.name || "홈";

  return (
    <LayoutStyle>
      <Header title={currentTitle} />
      <div className="p-4">{children}</div>
    </LayoutStyle>
  );
};

export default Layout;
