"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ConfettiPiece = ({
  style,
  className,
}: {
  style: React.CSSProperties;
  className?: string;
}) => <div style={style} className={cn("absolute", className)} />;

const createConfetti = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const colors = ["#F4B4C6", "#D0BCD5", "#FFFFFF", "#F9E7EA"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSize = Math.random() * (12 - 5) + 5;
    const randomLeft = Math.random() * 100;
    const randomAnimationDuration = Math.random() * (5 - 3) + 3;
    const randomAnimationDelay = Math.random() * 3;

    return {
      id: i,
      style: {
        backgroundColor: randomColor,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        left: `${randomLeft}vw`,
        top: "-20px",
        animation: `fall ${randomAnimationDuration}s linear ${randomAnimationDelay}s infinite`,
        transform: `rotate(${Math.random() * 360}deg)`,
      },
    };
  });
};

export function Confetti() {
  const [pieces, setPieces] = useState<
    { id: number; style: React.CSSProperties }[]
  >([]);

  useEffect(() => {
    setPieces(createConfetti(150));

    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
      @keyframes fall {
        0% { transform: translateY(0vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {pieces.map(({ id, style }) => (
        <ConfettiPiece key={id} style={style} />
      ))}
    </div>
  );
}
