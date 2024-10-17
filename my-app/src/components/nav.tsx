import React from "react";
import Link from "next/link";

import { CgAdd } from "react-icons/cg";
import { VscAccount } from "react-icons/vsc";

const navBar = () => {
  return (
    <div>
      <div className=" w-full bg-white"></div>
      <nav>
        <ul className="fixed bottom-0 w-screen min-h-14 bg-white md:hidden flex flex-row justify-around items-center border-t">
          <li className={` hover:text-darkpink `}>
            <Link href="/boards">
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                ></path>
              </svg>
            </Link>
          </li>

          <li className={` hover:text-darkpink `}>
            <Link href="/chat">
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </Link>
          </li>

          <li className={` hover:text-darkpink `}>
            <Link href="/write">
              <CgAdd className="w-7 h-7" />
            </Link>
          </li>
          <li className={` hover:text-darkpink `}>
            <Link href="/mypage">
              <VscAccount className="w-6 h-6" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default navBar;
