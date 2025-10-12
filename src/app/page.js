"use client";
import { useEffect, useRef, useState } from "react";
import ChatBox from "@/components/ChatBox";
import { imageToAscii } from "./imageToAscii.js";

export default function Home() {
  const canvasARef = useRef(null);
  const canvasBRef = useRef(null);
  const [activeCanvas, setActiveCanvas] = useState("A");
  const [dominantColor, setDominantColor] = useState({ r: 0, g: 174, b: 128 });
  const [size, setSize] = useState({ w: 0, h: 0 });

  // === Initialize window size ===
  useEffect(() => {
    if (typeof window === "undefined") return;
    setSize({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  // === Initial background load ===
  useEffect(() => {
    if (size.w === 0 || size.h === 0) return;
    if (!canvasARef.current) return;

    imageToAscii("/Start.png", 12, canvasARef.current)
      .then(({ dominantColor }) => {
        setDominantColor(dominantColor);
      })
      .catch(err => console.error("Failed to load initial ASCII:", err));
  }, [size]);

  // === Handle new image generation from ChatBox ===
  const handleImageGenerated = async (imageData) => {
    setActiveCanvas(prevActive => {
      const nextCanvas = prevActive === "A" ? canvasBRef.current : canvasARef.current;
      const currentCanvas = prevActive === "A" ? canvasARef.current : canvasBRef.current;

      if (!nextCanvas || !currentCanvas) return prevActive;

      // Draw new ASCII to the inactive canvas
      imageToAscii(imageData, 12, nextCanvas)
        .then(({ dominantColor: newColor }) => {
          setDominantColor(newColor);

          // Trigger fade transition
          nextCanvas.style.opacity = 1;
          currentCanvas.style.opacity = 0;
        })
        .catch(err => console.error("Failed to generate ASCII:", err));

      // Swap active canvas
      return prevActive === "A" ? "B" : "A";
    });
  };

  // === Debounced Resize Listener ===
  useEffect(() => {
    if (typeof window === "undefined") return;
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newW = window.innerWidth;
        const newH = window.innerHeight;
        if (Math.abs(newW - size.w) > 50 || Math.abs(newH - size.h) > 50) {
          setSize({ w: newW, h: newH });
        }
      }, 400);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [size]);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans m-0 p-0">
      {/* === Two layered ASCII canvases for fading === */}
      <canvas
        ref={canvasARef}
        className="ascii-layer absolute top-0 left-0 w-screen h-screen bg-black opacity-100"
      />
      <canvas
        ref={canvasBRef}
        className="ascii-layer absolute top-0 left-0 w-screen h-screen bg-black opacity-0"
      />

      {/* === Glowing Overlay === */}
      <div className="ascii-overlay absolute top-0 left-0 w-screen h-screen pointer-events-none" />

      {/* === Chat === */}
      <div className="relative z-10 flex items-center justify-center w-screen h-screen">
        <ChatBox onImageGenerated={handleImageGenerated} />
      </div>

      {/* === Styles === */}
      <style jsx>{`
        .ascii-layer {
          transition: opacity 1s ease-in-out;
        }

        /* === Subtle, alive ASCII brightness pulsing === */
        @keyframes asciiGlow {
          0%, 100% { opacity: 0.8; filter: brightness(1.0) saturate(1.1); }
          50% { opacity: 1; filter: brightness(1.25) saturate(1.3); }
        }

        /* === Smooth drifting glow motion === */
        @keyframes moveGlow {
          0%   { background-position: 0% 0%,   100% 100%, 50% 20%; }
          25%  { background-position: 25% 40%, 75% 60%, 60% 30%; }
          50%  { background-position: 60% 20%, 30% 80%, 40% 70%; }
          75%  { background-position: 40% 10%, 85% 85%, 20% 50%; }
          100% { background-position: 0% 0%,   100% 100%, 50% 20%; }
        }

        .ascii-bg {
          mix-blend-mode: lighten;
          animation: asciiGlow 8s ease-in-out infinite alternate;
        }

        .ascii-overlay {
          background-image:
            radial-gradient(circle at 30% 40%, rgba(${dominantColor.r},${dominantColor.g},${dominantColor.b},0.35), transparent 55%),
            radial-gradient(circle at 70% 70%, rgba(${dominantColor.r},${dominantColor.g},${dominantColor.b},0.28), transparent 50%),
            radial-gradient(circle at 50% 20%, rgba(${dominantColor.r},${dominantColor.g},${dominantColor.b},0.22), transparent 65%);
          background-size: 220% 220%;
          mix-blend-mode: lighten;
          filter: blur(1.5px) contrast(1.2);
          animation:
            asciiGlow 9s ease-in-out infinite alternate,
            moveGlow 22s ease-in-out infinite alternate;
        }

        .ascii-overlay::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 80% 20%, rgba(${dominantColor.r},${dominantColor.g},${dominantColor.b},0.25), transparent 55%);
          mix-blend-mode: screen;
          animation:
            asciiGlow 10s ease-in-out infinite alternate-reverse,
            moveGlow 28s ease-in-out infinite alternate-reverse;
        }
      `}</style>

    </div>
  );
}
