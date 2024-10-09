"use client";

import { redirect } from "next/navigation";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <div className="flex flex-row min-h-screen justify-center p-24"></div>
    </main>
  );
};

export default function Home() {
  redirect("/boards");
  return null; // 또는 빈 JSX 리턴
}
