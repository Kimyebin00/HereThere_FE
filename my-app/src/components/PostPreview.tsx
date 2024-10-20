"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StudyInCafeImage from "@/assets/previewImages/StudyInCafe.png";
import CoffeeChatImage from "@/assets/previewImages/CoffeeChat.png";
import BoardgameImage from "@/assets/previewImages/BoardGame.png";
import NoImage from "@/assets/previewImages/NoImage.png";
import LocationIcon from "@/assets/previewImages/LocationIcon.png";
import TimeIcon from "@/assets/previewImages/TimeIcon.png";
import PersonnelIcon from "@/assets/previewImages/PersonnelIcon.png";
import StaticImageData from "next/image";

interface PostPreviewProps {
  boardId: number;
  title: string;
  tag: string[];
  date: string;
  maxCapacity: number;
  locationName: string;
  status?: "OPEN" | "CLOSED";
  currentPerson: number;
  link?: string; // 추가된 부분
  onClick?: () => void; // 추가된 부분
}

const tagColors: { [key: string]: string } = {
  커피챗: "bg-rose-100",
  카공: "bg-blue-100",
  기타: "bg-green-100",
  보드게임: "bg-yellow-100",
};

const categoryImages: { [key: string]: typeof StaticImageData } = {
  커피챗: CoffeeChatImage,
  카공: StudyInCafeImage,
  보드게임: BoardgameImage,
  기타: NoImage, // 기타나 해당 카테고리가 없을 때는 NoImage를 사용
};

const PostPreview: React.FC<PostPreviewProps> = ({
  boardId,
  title,
  tag,
  date,
  maxCapacity,
  locationName,
  status, // 기본값 설정
  currentPerson: initialCurrentPerson,
  link,
  onClick,
}) => {
  const [currentPerson, setCurrentPerson] =
    useState<number>(initialCurrentPerson); // 초기 참여 인원 값 설정

  useEffect(() => {
    if (boardId) {
      const eventSource = new EventSource(
        `http://localhost:8000/sse/board/${boardId}`,
      );

      eventSource.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        setCurrentPerson(data.currentPerson);
      };

      eventSource.onerror = (error: Event) => {
        console.error("EventSource failed:", error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [boardId]);

  const tagColor =
    tag && tag.length > 0
      ? tagColors[tag[0]] || "bg-lightgray"
      : "bg-lightgray";

  const imageSrc =
    tag && tag.length > 0
      ? categoryImages[tag[0]].src || NoImage.src
      : NoImage.src;

  const content = (
    <div className="flex flex-row w-[30rem] xl:w-[32rem] h-32 bg-white rounded-3xl p-3 border border-1 border-lightgray cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-lightgray hover:border-darkpink ">
      <Image
        src={imageSrc} // 선택된 이미지 사용
        alt="Preview Image"
        priority
      />
      <div className="ml-3">
        <div className="flex justify-between items-center mb-1.5 w-[21rem] xl:w-[23rem]">
          <p className={`w-fit ${tagColor} px-2.5 py-0.5 rounded-xl text-xs`}>
            {tag && tag.length > 0 ? tag[0] : "알 수 없음"}
          </p>
          {status && (
            <p
              className={`flex items-center text-xs font-semibold ${
                status === "OPEN" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status === "OPEN" ? "모집 중" : "모집 종료"}
            </p>
          )}
        </div>
        <p className="text-base font-semibold mb-8">{title}</p>
        <div className="flex flex-row">
          <div className="flex flex-row mr-3 items-center">
            <Image
              src={LocationIcon}
              alt="Location Icon Image"
              width={18}
              height={18}
              priority
            />
            <span className="text-xs ml-1 text-gray-500 truncate w-[9rem] xl:w-[11rem]">{`${locationName}`}</span>
          </div>
          <div className="flex flex-row mr-3 items-center">
            <Image
              src={TimeIcon}
              alt="Time Icon Image"
              width={16}
              height={16}
              priority
            />
            <span className="text-xs ml-2 text-gray-500">{`${date}`}</span>
          </div>
          <div className="flex flex-row items-center">
            <Image
              src={PersonnelIcon}
              alt="Personnel Icon Image"
              width={22}
              height={22}
              priority
            />
            <span className="text-xs ml-1 text-gray-500">{`${currentPerson}/${maxCapacity}`}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} passHref>
        {content}
      </Link>
    );
  }

  return <div onClick={onClick}>{content}</div>;
};

export default PostPreview;
