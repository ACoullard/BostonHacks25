"use client";
import { useEffect, useState } from "react";
import ChatBox from "@/components/ChatBox";
import { imageToAscii } from "./imageToAscii";

export default function Home() {
  const [asciiArt, setAscii] = useState("");

  useEffect(() => {
    async function renderAscii() {
      const html = await imageToAscii("/Lake.jpg", 10);
      setAscii(html);
    }

    renderAscii();

    function handleResize() {
      renderAscii(); // regenerate ASCII for new window size
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans m-0 p-0">
      {/* === FULLSCREEN ASCII BACKGROUND === */}
      <pre
        className="absolute top-0 left-0 w-screen h-screen bg-black font-mono whitespace-pre select-none overflow-hidden m-0 p-0"
        style={{ fontSize: "10px", lineHeight: "1" }}  // Changed from "10px" to "1"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: asciiArt }}
      ></pre>

      {/* === CONTENT === */}
      <div className="relative z-10 w-screen h-screen grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 text-white m-0">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <ChatBox />

          <button className="mt-6 rounded-lg bg-green-400 text-black px-4 py-2 font-semibold hover:bg-green-300 transition">
            Change Background
          </button>
        </main>

        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        </footer>
      </div>
    </div>
  );
}
