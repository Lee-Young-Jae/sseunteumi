"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // useRouter 추가

const KakaoLogoutButton = () => {
  const { data: session } = useSession();
  const router = useRouter(); // useRouter 인스턴스 생성

  const handleLogout = async () => {
    if (session?.user?.accessToken) {
      try {
        const response = await fetch(`/api/auth/kakao-logout`);

        if (!response.ok) {
          console.error("카카오 로그아웃 실패");
          return;
        }

        await signOut({
          redirect: true,
          callbackUrl: "/",
        });
      } catch (error) {
        console.error("서버 Kakao 로그아웃 API 호출 에러:", error);
      }
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
