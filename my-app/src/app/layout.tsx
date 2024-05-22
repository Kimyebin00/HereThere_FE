import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import NavBar from "@/components/NavWeb";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-row">
        <NavBar />
        <main className="w-full">{children}</main>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"></script>

      </body>
    </html>
  );
}
