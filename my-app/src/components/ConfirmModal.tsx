import { useState } from "react";
import Image from "next/image";
import CloseOnIcon from "@/assets/post/closeOn.svg";
import CloseOffIcon from "@/assets/post/closeOff.svg";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="flex justify-center items-center w-full h-full bg-neutral-500/50 fixed top-0 left-0"
      onClick={onCancel}
    >
      <div
        className="flex flex-col relative md:w-[28rem] w-[22rem] h-[16rem] items-center justify-center bg-white rounded-[10px] px-8 py-6"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div
          className="flex absolute top-3 right-4 cursor-pointer"
          onClick={onCancel}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={isHovered ? CloseOnIcon : CloseOffIcon}
            alt="Close Off Icon"
            width={35}
            height={40}
            priority
          />
        </div>
        <h1 className="text-darkpink font-semibold text-2xl mb-[3.5rem]">
          채팅방을 나가시겠습니까?
        </h1>
        <div className="flex justify-center w-full">
          <button
            className="w-1/3 bg-darkpink text-white px-8 py-2 rounded-lg font-semibold text-md cursor-pointer"
            onClick={onConfirm}
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
