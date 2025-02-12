"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // useRouter 추가

const KakaoLogoutButton = () => {
  const { data: session } = useSession();
  const router = useRouter(); // useRouter 인스턴스 생성

  const handleLogout = async () => {
    if (session?.user?.accessToken) {
      try {
        const response = await fetch(`/api/auth/kakao-logout`, {
          method: "POST",
          body: JSON.stringify({ accessToken: session.user.accessToken }),
        });

        if (!response.ok) {
          console.error("카카오 로그아웃 실패");
          return;
        }

        console.log(response);

        await signOut();
      } catch (error) {
        console.error("서버 Kakao 로그아웃 API 호출 에러:", error);
      } finally {
        router.push("/"); // 로그아웃 후 홈페이지로 이동 (원하는 페이지로 변경 가능)
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
