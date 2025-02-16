import NextAuth, { NextAuthOptions, Session } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
// import { JWT } from "next-auth/jwt";
import { supabaseAdmin } from "@/app/lib/supabaseAdminClient";

interface KakaoProfile {
  id: number;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile: {
      nickname: string;
      profile_image_url: string;
      thumbnail_image_url: string;
    };
  };
}

// JWT 토큰 타입 확장
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    profile_image?: string;
    thumbnail_image_url?: string;
    id?: string;
  }
}

// 세션 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profile_image?: string;
      thumbnail_image_url?: string;
      accessToken: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "login",
        },
      },
    }),
  ],
  // JWT와 세션에 사용자 정보를 담기 위한 콜백
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const kakaoProfile = profile as KakaoProfile;
        token.accessToken = account.access_token;
        token.profile_image = kakaoProfile.properties.profile_image;
        token.thumbnail_image_url = kakaoProfile.properties.thumbnail_image;
        token.id = String(kakaoProfile.id);
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      // 클라이언트에서 session.user를 통해 사용자 정보에 접근할 수 있도록 함
      console.log({ session });
      session.user.profile_image = token.profile_image;
      session.user.thumbnail_image_url = token.thumbnail_image_url;
      session.user.id = token.id!;
      session.user.accessToken = token.accessToken!;
      return session;
    },
  },
  // 로그인 이벤트가 발생할 때, Supabase DB에 유저 정보를 삽입(또는 업데이트)하도록 이벤트 핸들러 추가
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      try {
        const kakaoProfile = profile as any;
        const { error } = await supabaseAdmin.from("users").upsert(
          {
            id: String(user.id),
            name: kakaoProfile.name,
            image: kakaoProfile.image,
          },
          { onConflict: "id" }
        );

        if (error) {
          console.error("Error upserting user into Supabase:", error);
        } else {
          console.log("User successfully upserted into Supabase");
        }
      } catch (err) {
        console.error("Error in signIn event callback:", err);
      }
    },
  },
  // 로그인 페이지 경로 지정 (예: 랜딩페이지)
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
