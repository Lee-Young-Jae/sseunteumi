// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { JWT } from "next-auth/jwt";

interface KakaoProfile {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  // 카카오 OAuth 인증만 사용
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  // JWT와 세션에 사용자 정보를 담기 위한 콜백
  callbacks: {
    async jwt({ token, account, profile }) {
      // 최초 로그인 시 account와 profile이 전달됨
      if (account && profile) {
        const kakaoProfile = profile as KakaoProfile;
        token.accessToken = account.access_token;
        token.profile_image = kakaoProfile.properties.profile_image;
        token.thumbnail_image_url = kakaoProfile.properties.thumbnail_image;
        token.id = String(kakaoProfile.id);
      }
      return token;
    },
    // 세션 생성 시 호출되는 콜백
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      // 클라이언트에서 session.user를 통해 사용자 정보에 접근할 수 있도록 함
      session.user.profile_image = token.profile_image;
      session.user.thumbnail_image_url = token.thumbnail_image_url;
      session.user.id = token.id!;
      session.user.accessToken = token.accessToken!;
      return session;
    },
  },
  // 로그인 페이지 경로 지정 (랜딩페이지를 로그인 페이지로 사용)
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
