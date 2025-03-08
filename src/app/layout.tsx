import type { Metadata } from "next";
import "./globals.css";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import Provider from "@/providers/Provider";

export const metadata: Metadata = {
  title: "쓴틈이",
  description: "현명한 소비습관, 쓴틈이",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="Ko">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
