"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";
import icons_chat from "@/assets/chat/icons_chat.svg";
import back from "@/assets/chat/icons_back.svg";
import PostPreview from "@/components/PostPreview";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import sendChatProps from "@/types/chat";

interface ChatRoom {
  id: number;
  board: {
    boardId: number;
    title: string;
    category: string;
    date: string;
    currentPerson: number;
    maxCapacity: number;
    location: {
      locationName: string;
    };
    status: "OPEN" | "CLOSED";
  };
}

// 사용자 정보를 가져오는 함수 (username 가져옴)
const fetchUserInfo = async () => {
  const response = await axios.get("http://localhost:8000/api/v1/users", {
    withCredentials: true,
  });
  return response.data.username; // username 반환
};

const fetchChatRooms = async () => {
  const response = await axios.get(
    "http://localhost:8000/api/v1/users/chatrooms",
    {
      withCredentials: true,
    },
  );
  return response.data;
};

const fetchChatRoomDetails = async (chatRoomId: number) => {
  const response = await axios.get(
    `http://localhost:8000/api/v1/chatrooms/${chatRoomId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

const sendMessage = async ({ chatRoomId, content }: sendChatProps) => {
  const response = await axios.post(
    `http://localhost:8000/api/v1/chatrooms/${chatRoomId}/messages`,
    { content },
    {
      withCredentials: true,
    },
  );
  return response.data;
};

const leaveChatRoom = async (chatRoomId: number) => {
  const response = await axios.delete(
    `http://localhost:8000/api/v1/chatrooms/${chatRoomId}/leave`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

const Chat = ({ params }: { params: { slug?: string[] } }) => {
  const [selectedChatRoom, setSelectedChatRoom] = useState<number | null>(null);
  const [pastMessages, setPastMessages] = useState<{
    [key: number]: { nickname: string; content: string }[];
  }>({});
  const [newMessages, setNewMessages] = useState<{
    [key: number]: { nickname: string; message: string }[];
  }>({});
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentUserNickname, setCurrentUserNickname] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chatListRef = useRef<HTMLDivElement | null>(null); // 목록 스크롤 Ref
  const chatRoomRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleChatButtonClick = () => {
    router.push("/chat");
  };

  // slug 값 확인 후 selectedChatRoom 설정
  useEffect(() => {
    const chatRoomId = params?.slug ? parseInt(params.slug[0], 10) : null;
    setSelectedChatRoom(chatRoomId);
  }, [params?.slug]);

  //현재 사용자 nickname 저장
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const nickname = await fetchUserInfo();
        setCurrentUserNickname(nickname);
        console.log("설정된 사용자 닉네임:", nickname);
      } catch (error) {
        console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
      }
    };
    getUserInfo();
  }, []);

  // 채팅방 목록 데이터 가져오기
  const { data, isLoading, error } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
  });

  // 선택된 채팅방의 세부 정보 가져오기
  const { data: chatRoomDetailsData } = useQuery({
    queryKey: ["chatRoomDetails", selectedChatRoom],
    queryFn: () => fetchChatRoomDetails(selectedChatRoom!),
    enabled: !!selectedChatRoom,
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
  });

  const leaveMutation = useMutation({
    mutationFn: leaveChatRoom,
    onSuccess: () => {
      router.push("/chat"); // 채팅방을 나가면 기본 채팅 경로로 리다이렉트
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    },
  });

  const handleLeaveChatRoom = () => {
    setIsModalOpen(true); // 나가기 버튼을 눌렀을 때 모달 열림
  };

  const handleConfirmLeave = () => {
    setIsModalOpen(false); // 모달 닫기
    if (selectedChatRoom) {
      leaveMutation.mutate(selectedChatRoom); // 확인을 누르면 채팅방 나가기
    }
  };

  const handleCancelLeave = () => {
    setIsModalOpen(false); // 취소를 누르면 모달 닫기
  };

  // 채팅방 클릭 시 스크롤 위치를 저장
  const handleChatRoomClick = (chatRoomId: number) => {
    if (chatListRef.current) {
      sessionStorage.setItem(
        "scrollPosition",
        chatListRef.current.scrollTop.toString(),
      ); // 스크롤 위치를 sessionStorage에 저장
    }
    router.push(`/chat/${chatRoomId}`); // 채팅방 이동
  };

  // 목록이 렌더링될 때 스크롤 위치를 복원
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (chatListRef.current && savedPosition) {
      chatListRef.current.scrollTop = parseInt(savedPosition, 10); // 저장된 위치로 스크롤 이동
    }
  }, [data]);

  // 새로운 메시지가 생기거나 채팅방에 들어갈 때 자동으로 스크롤 하단으로 유지
  const scrollToBottom = () => {
    if (chatRoomRef.current) {
      chatRoomRef.current.scrollTop = chatRoomRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (chatRoomDetailsData) {
      setPastMessages(prev => ({
        ...prev,
        [selectedChatRoom!]: chatRoomDetailsData.messages || [],
      }));
      scrollToBottom(); // 채팅방에 들어갈 때 스크롤 하단으로
    }
  }, [chatRoomDetailsData, selectedChatRoom]);

  useEffect(() => {
    if (newMessages[selectedChatRoom!]?.length > 0) {
      scrollToBottom(); // 새로운 메시지가 있을 때 스크롤 하단으로
    }
  }, [newMessages]);

  useEffect(() => {
    socketRef.current = io("http://localhost:8000");
    const handleConnect = () => {
      console.log("Connected to Socket.IO server");
    };

    const handleDisconnect = () => {
      console.log("Disconnected from Socket.IO server");
    };

    const handleBroadcastMessage = message => {
      const updatedMessage = {
        ...message,
        nickname: message.nickName, // nickName을 nickname으로 매핑
      };

      setNewMessages(prevMessages => ({
        ...prevMessages,
        [message.chatRoomId]: [
          ...(prevMessages[message.chatRoomId] || []),
          updatedMessage,
        ],
      }));
    };

    socketRef.current.on("connect", handleConnect);
    socketRef.current.on("broadcastMessage", handleBroadcastMessage);
    socketRef.current.on("disconnect", handleDisconnect);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect", handleConnect);
        socketRef.current.off("broadcastMessage", handleBroadcastMessage);
        socketRef.current.off("disconnect", handleDisconnect);
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (selectedChatRoom && newMessage.trim() !== "") {
      mutation.mutate({ chatRoomId: selectedChatRoom, content: newMessage });
      setNewMessage("");
    } else {
      console.error("Message is empty or chat room is not selected");
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>로그인 후 이용가능합니다.</p>;

  const selectedChatRoomTitle = data?.chatRooms?.find(
    room => room.board.boardId === selectedChatRoom,
  )?.board.title;

  return (
    <div className="flex h-screen overflow-hidden">
      <main className="chat flex w-[100%] min-h-screen">
        <div
          className="chat_list flex flex-col mb-[1rem] bg-white xl:border-r xl:w-[62rem] lg:w-[40rem] lg:border-r md:w-[30rem] md:border-r w-[0%] overflow-auto"
          ref={chatListRef} // 목록의 스크롤 Ref
        >
          <div className="flex justify-between m-[1rem] px-[1rem] mt-[2rem]">
            <div
              className="flex items-center cursor-pointer"
              onClick={handleChatButtonClick}
            >
              <Image src={icons_chat} alt="채팅 아이콘" />
              <h1 className="text-[1.5rem] font-semibold ml-[0.5rem]">CHAT</h1>
            </div>
          </div>
          <ul className="flex flex-col px-[1rem] mx-auto">
            {data?.chatRooms.map((chatRoom: ChatRoom) => (
              <li
                key={chatRoom.id}
                className={`mb-4 border ${
                  selectedChatRoom === chatRoom.id
                    ? "border-darkpink" //  채팅방에만 테두리 색상 적용
                    : "border-transparent"
                } rounded-3xl border-2`}
              >
                <PostPreview
                  key={chatRoom.id}
                  board_id={chatRoom.board.boardId}
                  title={chatRoom.board.title}
                  tag={[chatRoom.board.category]}
                  date={chatRoom.board.date}
                  currentPerson={chatRoom.board.currentPerson}
                  maxCapacity={chatRoom.board.maxCapacity}
                  locationName={chatRoom.board.location.locationName}
                  status={chatRoom.board.status}
                  onClick={() => handleChatRoomClick(chatRoom.id)} // 클릭 시 스크롤 위치 저장 및 이동
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="chat_room w-full min-h-screen flex flex-col overflow-auto">
          {selectedChatRoom ? (
            <>
              <div className="flex justify-between m-[1rem] px-[1rem] mt-[2rem]">
                <div className="flex items-center">
                  <Image src={icons_chat} alt="채팅 아이콘" />
                  <h1 className="text-[1.5rem] font-semibold ml-[0.5rem]">
                    {selectedChatRoomTitle || "채팅방을 선택하세요"}
                  </h1>
                </div>
                <button onClick={handleLeaveChatRoom}>
                  <Image src={back} alt="뒤로" />
                </button>
              </div>

              <ConfirmModal
                isOpen={isModalOpen}
                onConfirm={handleConfirmLeave}
                onCancel={handleCancelLeave}
              />

              <div
                className="flex-grow py-4 px-[2rem] overflow-auto"
                ref={chatRoomRef}
              >
                {selectedChatRoom &&
                  (pastMessages[selectedChatRoom] || []).map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 flex ${
                        msg.nickname === currentUserNickname
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          msg.nickname === currentUserNickname
                            ? "bg-pink text-black"
                            : "bg-lightgray text-black"
                        }`}
                      >
                        <strong>{msg.nickname || "익명"} : </strong>
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  ))}
                {selectedChatRoom &&
                  (newMessages[selectedChatRoom] || []).map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 flex ${
                        msg.nickname === currentUserNickname
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          msg.nickname === currentUserNickname
                            ? "bg-pink text-black"
                            : "bg-lightgray text-black"
                        }`}
                      >
                        <strong>{msg.nickname} : </strong>
                        <span>{msg.message}</span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="input_container flex items-center justify-center px-[2rem] py-[1rem] mb-16 md:mb-0">
                <input
                  type="text"
                  className="h-[3rem] mr-[1rem] border border-lightgray rounded-lg px-4 w-full"
                  placeholder="메시지를 입력하세요..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="w-[6rem] h-[3rem] bg-darkpink  rounded-lg text-white"
                  onClick={handleSendMessage}
                >
                  전송
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <h1 className="text-[1.5rem] font-semibold">
                채팅방을 선택하세요
              </h1>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
