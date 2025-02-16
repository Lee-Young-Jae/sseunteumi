// import KakaoLogoutButton from "../main/component/KakaoLogoutButton";
import { usePathname, useRouter } from "next/navigation";
import { LuCalendarDays, LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineHome } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoStatsChartOutline } from "react-icons/io5";
import { routeOption } from "../util/routeOption";
import { useMemo } from "react";

const NavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const icons = {
    "/main": AiOutlineHome,
    "/calendar": LuCalendarDays,
    "/dashboard": LuLayoutDashboard,
    "/statistics": IoStatsChartOutline,
    "/settings": IoSettingsOutline,
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = useMemo(
    () => (path: string) => pathname === path,
    [pathname]
  );

  return (
    <nav className="w-full bg-white border-t border-gray-200 safe-area-bottom fixed bottom-0 max-w-screen-sm left-1/2 -translate-x-1/2">
      <div className="grid grid-cols-5 h-14">
        {routeOption.map((route) => {
          const Icon = icons[route.path as keyof typeof icons];
          return (
            <button
              key={route.path}
              onClick={() => handleNavigation(route.path)}
              className="flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Icon
                className={`text-2xl transition-colors ${
                  isActive(route.path) ? "text-blue-500" : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  isActive(route.path)
                    ? "text-blue-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                {route.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationBar;
