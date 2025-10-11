"use client";

import { useState } from "react";
import Image from "next/image";

import { get_stored, increment_stored } from "@/lib/actions/resources";

export default function Home() {
  // === Expanded ASCII scenes ===
  const asciiArtList = [
`                     &&& &&  & &&
              && &\\/&\\|& ()|/ @, &&
             &\\/(/&/&||/& /_/)_&/_&
          &() &\\/&|()|/&\\/ '%" & ()
         &_\\_&&_\\ |& |&&/&__%_/_& &&
     &&   && & &| &| /& & % ()& /&&
      ()&_---()&\\&\\|&&-&&--%---()~
            &&     \\|||             &&&
                    |||              &&
                    |||          &&   &&
                    |||        &&&&&   &&
                    |||       &&  &&    &
                    |||      &&   &&&
                    |||     &&    &&&
                    |||    &&      &&
                    |||   &&       &&
              __---|||---__      &&&&&
        , -=-~  .-^- _.     -=-~     _-^-_.~=-,
`,
`
        🌲🌲🌲  ENCHANTED FOREST  🌲🌲🌲
 ____________________________________________________________
 |^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|
 |                                                         |
 |   /\\      /\\     /\\        /\\     /\\        /\\     /\\   |
 |  /  \\    /  \\   /  \\      /  \\   /  \\      /  \\   /  \\  |
 |_/____\\__/____\\_/____\\____/____\\_/____\\____/____\\_/____\\_|
 |  ||  ||  ||  ||  ||  ||  ||  ||  ||  ||  ||  ||  ||  || |
 |  ||  ||  ||  ||  ||  ||  ||  ||  ||  ||  ||  ||  ||  || |
 |                                                         |
 |^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|
 |_________________________________________________________|
`
  ];

  const [index, setIndex] = useState(0);
  const nextArt = () => setIndex((i) => (i + 1) % asciiArtList.length);


  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* === FULLSCREEN ASCII BACKGROUND === */}
      <pre
        className="
          absolute inset-0
          bg-black text-green-400 font-mono
          whitespace-pre leading-none text-[clamp(8px,1vw,14px)]
          flex items-center justify-center text-center select-none
          px-[2vw] py-[2vh]
        "
        aria-hidden="true"
      >
        {asciiArtList[index]}
      </pre>

      {/* === YOUR ORIGINAL CONTENT === */}
      <div className="relative z-10 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 text-white">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />

          <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="bg-black/30 dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
                src/app/page.js
              </code>
              .
            </li>
            <li className="tracking-[-.01em]">Save and see your changes instantly.</li>
          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-400 text-black gap-2 hover:bg-green-300 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center hover:bg-white/10 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>

          {/* === BUTTON TO CHANGE BACKGROUND === */}
          <button
            onClick={nextArt}
            className="mt-6 rounded-lg bg-green-400 text-black px-4 py-2 font-semibold hover:bg-green-300 transition"
          >
            Change Background
          </button>
        </main>

        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/templates"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </div>
  );
}
