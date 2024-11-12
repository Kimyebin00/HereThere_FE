"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/assets/Logo.svg";

const redirectUri = "https://meetingsquare.site/api/v1/auth/redirect";
const scope = ["profile_nickname"].join(",");

// Kakao 객체의 타입을 명확히 선언
interface KakaoSDK {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Auth: {
    authorize: (options: { redirectUri: string; scope: string }) => void;
  };
}

// window 객체에 Kakao가 있음을 선언 (타입스크립트에 명확히 알림)
declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);

  useEffect(() => {
    const loadKakaoSDK = () => {
      return new Promise<KakaoSDK | undefined>((resolve, reject) => {
        if (typeof window === "undefined") return;
        if (window.Kakao) return resolve(window.Kakao);

        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => {
          if (window.Kakao) {
            resolve(window.Kakao);
          } else {
            reject("Kakao SDK 로드 실패");
          }
        };
        script.onerror = () => {
          console.error("Kakao SDK 스크립트 로드에 실패했습니다.");
          reject("Kakao SDK 로드 실패");
        };
        document.head.appendChild(script);
      });
    };

    loadKakaoSDK()
      .then(Kakao => {
        if (Kakao && !Kakao.isInitialized()) {
          // Kakao SDK 초기화
          Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);

          // 초기화 여부 확인
          if (Kakao.isInitialized()) {
            console.log("Kakao SDK 초기화되었습니다.");
            setIsKakaoInitialized(true); // 초기화 성공 시 상태 업데이트
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const kakaoLoginHandler = () => {
    // 로그인 요청
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri,
        scope,
      });
      console.log("카카오 로그인 요청");
      router.replace("/boards");
    } else {
      console.error("Kakao SDK가 초기화되지 않았습니다.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex pt-36 pb-12 justify-center items-center">
        <Image src={Logo} alt="Logo" width={400} height={400} />
      </div>
      <div className="flex justify-center gap-4">
        {/* SDK가 초기화될 때까지 로그인 버튼을 비활성화 */}
        <button
          onClick={kakaoLoginHandler}
          className={`w-[22.5rem] h-[3rem] rounded-[0.25rem] ${
            isKakaoInitialized ? "bg-yellow-400" : "bg-gray-400"
          }`}
          disabled={!isKakaoInitialized}
        >
          <span className="text-base font-semibold">Kakao로 간편 로그인</span>
        </button>
      </div>
    </main>
  );
}
