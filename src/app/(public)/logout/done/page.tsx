"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

const LogoutDonePage = () => {
  useEffect(() => {
    // NextAuth의 세션 삭제 등 서비스 로그아웃 처리
    signOut({ redirect: true, callbackUrl: "/" });
  }, []);

  return <p>로그아웃 중입니다...</p>;
};

export default LogoutDonePage;
