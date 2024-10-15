import React from "react";
import Link from "next/link";
import Image from "next/image";
import main from "../assets/nav/main.svg";
import main_hover from "../assets/nav/main_hover.svg";
import chat from "../assets/nav/chat.svg";
import write from "../assets/nav/write.svg";
import mypage from "../assets/nav/mypage.svg";

const navBar = () => {
  return (
    <div>
      <div className=" w-full bg-white"></div>
      <nav>
        <ul className="fixed bottom-0 w-screen min-h-14 bg-white md:hidden flex flex-row justify-around items-center border-t">
          <li>
            <Link href="/boards">
              <Image src={main ? main_hover : main} alt="메인게시판" />
            </Link>
          </li>
          <li>
            <Link href="/chat">
              <Image className="" src={chat} alt="채팅" />
            </Link>
          </li>{" "}
          <li>
            <Link href="/write">
              <Image src={write} alt="작성" />
            </Link>
          </li>
          <li>
            <Link href="/mypage">
              <Image src={mypage} alt="마이 페이지" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default navBar;
