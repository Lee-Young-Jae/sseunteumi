"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // useRouter 추가

const KakaoLogoutButton = () => {
  const { data: session } = useSession();
  const router = useRouter(); // useRouter 인스턴스 생성

  const handleLogout = async () => {
    if (session?.user?.accessToken) {
      try {
        // 1. next-auth signOut() 먼저 호출하여 클라이언트 세션 제거
        await signOut({ redirect: false }); // redirect: false를 사용하여 페이지 리디렉션 방지

        // 2. (선택 사항) 카카오 로그아웃 API 호출 (사용자 경험 개선)
        const response = await fetch(`/api/auth/kakao-logout`, {
          method: "POST",
          body: JSON.stringify({ accessToken: session.user.accessToken }),
        });

        if (!response.ok) {
          console.error("카카오 로그아웃 실패");
          return;
        }

        console.log(response);
      } catch (error) {
        console.error("서버 Kakao 로그아웃 API 호출 에러:", error);
      } finally {
        // 3. 로그아웃 후 홈페이지("/") 또는 로그인 페이지로 리디렉션 (선택 사항)
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
