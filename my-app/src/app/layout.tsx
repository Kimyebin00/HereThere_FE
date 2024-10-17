import type { Metadata } from "next";
import "../styles/globals.css";
import ReactQueryProviders from "@/utils/react-query-provider";
import WebNavBar from "@/components/navweb";
import MobileNavBar from "@/components/nav";
import Script from "next/script";

export const metadata: Metadata = {
  title: "요기조기",
  description: "모두모여! 요기조기!",
  icons: {
    icon: "icons/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Kakao SDK Script */}
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
          strategy="beforeInteractive" // 스크립트를 페이지 렌더링 전에 비동기적으로 로드
        />
      </head>
      <body className="flex md:flex-row flex-col">
        <Script
          async
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.3.0/kakao.min.js"
          integrity="sha384-70k0rrouSYPWJt7q9rSTKpiTfX6USlMYjZUtr1Du+9o4cGvhPAWxngdtVZDdErlh"
          crossOrigin="anonymous"
        ></Script>
        <div className="h-1/6">
          <WebNavBar />
        </div>
        <main className="w-full h-4/6">
          <ReactQueryProviders>{children}</ReactQueryProviders>
        </main>
        <div className="h-1/6">
          <MobileNavBar />
        </div>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"
          strategy="lazyOnload" // 페이지 로드 후 스크립트 로드
        />
      </body>
    </html>
  );
}
