import Link from "next/link";
import KakaoLoginButton from "./component/KakaoLoginButton";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-[#f5f5ff] via-white to-white">
      <section className="max-w-3xl text-center overflow-hidden">
        <h1 className="flex flex-wrap justify-center text-4xl leading-[140%] font-bold gap-2">
          <span
            className="text-text-gray01 inline-block animate-slide-in opacity-0"
            style={{ animationDelay: "0s" }}
          >
            소중한
          </span>
          <span
            className="text-text-gray01 inline-block animate-slide-in opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            재정,
          </span>
          <span className="basis-full h-0"></span>
          <span
            className="text-text-gray01 inline-block animate-slide-in opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            기록하고
          </span>
          <span
            className="text-text-gray01 inline-block animate-slide-in opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            관리하는
          </span>
          <span
            className="text-primary inline-block animate-slide-in opacity-0 text-text-blue02"
            style={{ animationDelay: "0.45s" }}
          >
            쓴틈이.
          </span>
        </h1>
        <div
          className="flex flex-col items-center animate-fade-up opacity-0 pb-6"
          style={{ animationDelay: "0.85s" }}
        >
          <p className="rounded-md p-4 mt-6 text-text-gray01">
            번거롭게 관리하던 지출 관리는 이제 그만! <br />
            쓴틈이에서 간편하게 기록하고 관리해보세요.
          </p>

          {/* 로그인 버튼 */}
          <KakaoLoginButton />
        </div>
      </section>
    </main>
  );
}
