import { NextRequest, NextResponse } from "next/server";
import { signOut } from "next-auth/react";

export async function GET(request: NextRequest) {
  // 쿠키에서 세션 정보 삭제
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("next-auth.callback-url");
  response.cookies.delete("next-auth.csrf-token");

  return response;
}
