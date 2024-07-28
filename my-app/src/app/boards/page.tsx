"use client";

import PostPreview from "@/components/PostPreview";
import MainTab from "@/components/MainTab";
import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Board } from "@/types/boards";
import token from "@/constants/loginToken";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const getBoards = async (page: number, limit: number) => {
  const res = await axios.get("http://localhost:8000/api/v1/boards/", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: { page, limit },
  });
  return res.data;
};

const Boards = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState<"OPEN" | "CLOSED" | "">(
    "",
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth >= 1280) {
        setLimit(8);
      } else {
        setLimit(4);
      }
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);

    return () => {
      window.removeEventListener("resize", updateLimit);
    };
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["boards", page],
    queryFn: () => getBoards(page, limit),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const posts = data?.data || [];
  const totalPage = data?.totalPage || 0;

  useEffect(() => {
    console.log("Loading:", isLoading);
    console.log("Data:", posts);
  }, [isLoading, posts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (status: "OPEN" | "CLOSED") => {
    setSelectedStatus(prevStatus => (prevStatus === status ? "" : status));
  };

  const filteredData = posts.filter((data: Board) => {
    const categoryMatch =
      selectedCategory === "전체" || data.category === selectedCategory;

    const statusMatch = selectedStatus === "" || data.status === selectedStatus;

    return categoryMatch && statusMatch;
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex justify-center lg:justify-start lg:pl-[4rem] xl:pl-[6rem] py-4 md:py-7">
        <MainTab onCategoryChange={handleCategoryChange} />
      </div>
      <div className="flex justify-center lg:justify-start gap-[0.75rem] lg:gap-[1.25rem] px-[2rem] lg:px-[6rem] xl:px-[8rem]">
        <button
          onClick={() => handleStatusChange("OPEN")}
          className={`w-[5rem] lg:w-[6.25rem] h-[2rem] lg:h-[2.25rem] border border-1 rounded-[1.25rem] ${
            selectedStatus === "OPEN"
              ? "border-darkpink bg-pink"
              : "border-gray"
          }`}
        >
          <span className="text-xs">모집 중</span>
        </button>
        <button
          onClick={() => handleStatusChange("CLOSED")}
          className={`w-[5rem] lg:w-[6.25rem] h-[2rem] lg:h-[2.25rem] border border-1 rounded-[1.25rem] ${
            selectedStatus === "CLOSED"
              ? "border-darkpink bg-pink"
              : "border-gray"
          }`}
        >
          <span className="text-xs">모집 종료</span>
        </button>
      </div>
      <div className="flex justify-center">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 py-[1.5rem]">
            {filteredData.map((data: Board) => (
              <PostPreview
                key={data.id}
                boardId={data.id}
                title={data.title}
                tag={[data.category]}
                date={data.date}
                time={data.startTime}
                maxCapacity={data.maxCapacity}
                locationName={data.location.locationName}
                status={data.status}
                currentPerson={data.currentPerson}
              />
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-16 sm:bottom-2 w-full py-2">
        <Stack
          spacing={2}
          className="flex justify-center items-center sm:mr-[5rem]"
        >
          <Pagination
            count={totalPage}
            page={page}
            onChange={handlePageChange}
          />
        </Stack>
      </div>
    </main>
  );
};

export default Boards;
