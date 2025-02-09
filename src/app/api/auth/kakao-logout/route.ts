import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { message: "액세스 토큰이 없습니다." },
        { status: 401 }
      );
    }

    const url = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${process.env.KAKAO_LOGOUT_REDIRECT_URI}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      console.error("카카오 로그아웃 실패:", await response.text());
      return NextResponse.json(
        { message: "카카오 로그아웃 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("카카오 로그아웃 API 에러:", error);
    return NextResponse.json(
      { message: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  }
}
