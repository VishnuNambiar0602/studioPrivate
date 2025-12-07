"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  timestamp: string;
  avatar: string;
  name: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hey, my love! I made this little world just for us. ❤️",
    sender: "me",
    timestamp: "10:00 AM",
    avatar: "https://picsum.photos/seed/p1/40/40",
    name: "You",
  },
  {
    id: 2,
    text: "Oh wow! This is the sweetest thing ever! I love it!",
    sender: "them",
    timestamp: "10:01 AM",
    avatar: "https://picsum.photos/seed/p2/40/40",
    name: "Your Love",
  },
  {
    id: 3,
    text: "I'm so glad you like it. I can't wait to fill it with our memories.",
    sender: "me",
    timestamp: "10:02 AM",
    avatar: "https://picsum.photos/seed/p1/40/40",
    name: "You",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "https://picsum.photos/seed/p1/40/40",
      name: "You",
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen flex-col bg-background p-4 md:p-6">
      <header className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold">Our Secret Chat</h1>
        <p className="text-muted-foreground">A place to share our thoughts.</p>
      </header>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-3",
                message.sender === "me" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "them" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatar} alt={message.name} />
                  <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs rounded-lg p-3 lg:max-w-md",
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p className="mt-1 text-xs text-right opacity-70">{message.timestamp}</p>
              </div>
              {message.sender === "me" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatar} alt={message.name} />
                  <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t pt-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message to your love..."
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" className="shrink-0">
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
