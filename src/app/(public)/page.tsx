import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-[#e8e8f6] via-white to-white">
      <section className="max-w-3xl text-center overflow-hidden">
        <h1 className="flex flex-wrap justify-center text-4xl leading-[140%] font-bold gap-2">
          <span
            className="text-text-secondary inline-block animate-slide-in opacity-0"
            style={{ animationDelay: "0s" }}
          >
            소중한
          </span>
          <span
            className="text-text-secondary inline-block animate-slide-in opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            재정,
          </span>
          <span className="basis-full h-0"></span>
          <span
            className="text-text-secondary inline-block animate-slide-in opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            기록하고
          </span>
          <span
            className="text-text-secondary inline-block animate-slide-in opacity-0"
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
          style={{ animationDelay: "0.8s" }}
        >
          <p className="rounded-md p-4 mt-6 text-text-gray01">
            번거롭게 관리하던 재정 기록은 이제 그만! <br />
            쓴틈이에서 간편하게 기록하고 관리해보세요.
          </p>

          {/* 로그인 버튼 */}
          <Link
            href="/login"
            className="mt-6 mx-auto bg-[#FEE500] text-[#000000] px-8 py-4 rounded-[12px] text-lg font-medium flex items-center justify-center w-fit"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="mr-2"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.0009 3C17.7999 3 22.501 6.66445 22.501 11.1847C22.501 15.705 17.7999 19.3694 12.0009 19.3694C11.4127 19.3694 10.8361 19.331 10.2742 19.2586L5.86611 22.1419C5.36471 22.4073 5.18769 22.3778 5.39411 21.7289L6.28571 18.0513C3.40572 16.5919 1.50098 14.0619 1.50098 11.1847C1.50098 6.66445 6.20194 3 12.0009 3ZM17.908 11.0591L19.3783 9.63617C19.5656 9.45485 19.5705 9.15617 19.3893 8.96882C19.2081 8.78172 18.9094 8.77668 18.7219 8.95788L16.7937 10.8239V9.28226C16.7937 9.02172 16.5825 8.81038 16.3218 8.81038C16.0613 8.81038 15.8499 9.02172 15.8499 9.28226V11.8393C15.8321 11.9123 15.8325 11.9879 15.8499 12.0611V13.5C15.8499 13.7606 16.0613 13.9719 16.3218 13.9719C16.5825 13.9719 16.7937 13.7606 16.7937 13.5V12.1373L17.2213 11.7236L18.6491 13.7565C18.741 13.8873 18.8873 13.9573 19.0357 13.9573C19.1295 13.9573 19.2241 13.9293 19.3066 13.8714C19.5199 13.7217 19.5713 13.4273 19.4215 13.214L17.908 11.0591ZM14.9503 12.9839H13.4904V9.29702C13.4904 9.03648 13.2791 8.82514 13.0184 8.82514C12.7579 8.82514 12.5467 9.03648 12.5467 9.29702V13.4557C12.5467 13.7164 12.7579 13.9276 13.0184 13.9276H14.9503C15.211 13.9276 15.4222 13.7164 15.4222 13.4557C15.4222 13.1952 15.211 12.9839 14.9503 12.9839ZM9.09318 11.8925L9.78919 10.1849L10.4265 11.8925H9.09318ZM11.6159 12.3802C11.6161 12.3748 11.6175 12.3699 11.6175 12.3645C11.6175 12.2405 11.5687 12.1287 11.4906 12.0445L10.4452 9.24376C10.3468 8.9639 10.1005 8.77815 9.81761 8.77028C9.53948 8.76277 9.28066 8.93672 9.16453 9.21669L7.50348 13.2924C7.40519 13.5337 7.52107 13.8092 7.76242 13.9076C8.00378 14.006 8.2792 13.89 8.37749 13.6486L8.70852 12.8364H10.7787L11.077 13.6356C11.1479 13.8254 11.3278 13.9426 11.5193 13.9425C11.5741 13.9425 11.6298 13.9329 11.6842 13.9126C11.9284 13.8216 12.0524 13.5497 11.9612 13.3054L11.6159 12.3802ZM8.29446 9.30194C8.29446 9.0414 8.08312 8.83006 7.82258 8.83006H4.57822C4.31755 8.83006 4.10622 9.0414 4.10622 9.30194C4.10622 9.56249 4.31755 9.77382 4.57822 9.77382H5.73824V13.5099C5.73824 13.7705 5.94957 13.9817 6.21012 13.9817C6.47078 13.9817 6.68212 13.7705 6.68212 13.5099V9.77382H7.82258C8.08312 9.77382 8.29446 9.56249 8.29446 9.30194Z"></path>
            </svg>
            카카오톡으로 간편 로그인
          </Link>
        </div>
      </section>
    </main>
  );
}
