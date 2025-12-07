"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Confetti } from "@/components/confetti";
import { RunawayButton } from "@/components/runaway-button";

export default function Home() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [yesButtonSize, setYesButtonSize] = useState(1);
  const bgImage = PlaceHolderImages.find((img) => img.id === "landing-bg");

  const handleYesClick = () => {
    setShowConfetti(true);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  const handleYesButtonGrow = () => {
    setYesButtonSize((prev) => prev + 0.5);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover z-0 opacity-20"
          data-ai-hint={bgImage.imageHint}
        />
      )}
      {showConfetti && <Confetti />}
      <Card className="w-full max-w-md z-10 shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
             <Heart className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <CardTitle className="font-headline text-4xl">Forever Us</CardTitle>
          <CardDescription className="font-body text-lg">
            A very important question for you...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="font-headline text-3xl font-semibold">
            Do you love me?
          </p>
        </CardContent>
        <CardFooter className="relative flex items-center justify-center h-48">
            <Button
              size="lg"
              onClick={handleYesClick}
              className="z-10 w-32 transition-all duration-300 ease-in-out"
              style={{ transform: `scale(${yesButtonSize})` }}
            >
              <Heart className="mr-2 h-4 w-4 fill-primary-foreground" /> Yes
            </Button>
            <RunawayButton onYesButtonGrow={handleYesButtonGrow} />
        </CardFooter>
      </Card>
    </main>
  );
}
