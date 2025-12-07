"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface RunawayButtonProps {
  onYesButtonGrow: () => void;
}

const noMessages = [
  "No",
  "Are you sure?",
  "Really?",
  "Think again!",
  "Last chance!",
  "Don't do it!",
  "You'll regret this!",
  "I'm warning you!",
];

export function RunawayButton({ onYesButtonGrow }: RunawayButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messageIndex, setMessageIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseEnter = () => {
    if (!isClient) return;

    onYesButtonGrow();
    setMessageIndex((prev) => (prev + 1) % noMessages.length);

    const button = buttonRef.current;
    if (!button) return;

    const container = button.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const maxX = containerRect.width - buttonRect.width;
    const maxY = containerRect.height - buttonRect.height;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setPosition({ x: newX, y: newY });
  };

  if (!isClient) {
    return <Button variant="destructive">No</Button>;
  }
  
  return (
    <Button
      ref={buttonRef}
      variant="destructive"
      onMouseEnter={handleMouseEnter}
      onClick={handleMouseEnter}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: "all 0.3s ease",
      }}
      className="w-24"
    >
      {noMessages[messageIndex]}
    </Button>
  );
}
