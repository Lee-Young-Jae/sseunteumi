"use client";

import { useSession, signOut } from "next-auth/react";

const KakaoLogoutButton = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      if (session?.user?.accessToken) {
        const response = await fetch(`/api/auth/kakao-logout`);
        if (!response.ok) {
          console.error(response.statusText);
          return;
        }
      }

      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("로그아웃 처리 중 에러 발생:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition"
    >
      로그아웃
    </button>
  );
};

export default KakaoLogoutButton;
