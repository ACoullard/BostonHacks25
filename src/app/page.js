"use client";

import { useState } from "react";
import Image from "next/image";

import { get_stored, increment_stored } from "@/lib/actions/resources";
import ChatBox from "@/components/ChatBox";

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
          {/* === CHAT BOX === */}
          <ChatBox />

          {/* === BUTTON TO CHANGE BACKGROUND === */}
          <button
            onClick={nextArt}
            className="mt-6 rounded-lg bg-green-400 text-black px-4 py-2 font-semibold hover:bg-green-300 transition"
          >
            Change Background
          </button>
        </main>

        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        </footer>
      </div>
    </div>
  );
}
