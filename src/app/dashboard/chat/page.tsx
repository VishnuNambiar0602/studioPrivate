"use client";

import { useState, useRef, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, SendHorizonal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser, addDocumentNonBlocking } from "@/firebase";

export const dynamic = 'force-dynamic';

interface Message {
  id?: string;
  text: string;
  senderId: string;
  timestamp: any;
  avatar: string;
  name: string;
}

export default function ChatPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users', 'shared', 'chatMessages');
  }, [firestore]);

  const messagesQuery = useMemoFirebase(() => {
    if (!messagesCollection) return null;
    return query(messagesCollection, orderBy('timestamp', 'asc'));
  }, [messagesCollection]);

  const { data: messages, isLoading } = useCollection<Message>(messagesQuery);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user || !messagesCollection) return;
    
    const petName = localStorage.getItem("petName");

    const message: Omit<Message, 'id' | 'timestamp'> = {
      text: newMessage,
      senderId: user.uid,
      avatar: `https://picsum.photos/seed/${petName === 'vishnu' ? 'p1' : 'p2'}/40/40`,
      name: petName === 'vishnu' ? "Vishnu" : "Vaishakhanandini",
    };
    
    const messageWithTimestamp = {
        ...message,
        timestamp: serverTimestamp(),
    }

    try {
      addDocumentNonBlocking(messagesCollection, messageWithTimestamp);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const getSender = (message: Message) => {
    if (!user) return 'them';
    return message.senderId === user.uid ? 'me' : 'them';
  }

  return (
    <div className="flex h-screen flex-col bg-background p-4 md:p-6">
      <header className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold">Our Secret Chat</h1>
        <p className="text-muted-foreground">A place to share our thoughts.</p>
      </header>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          {isLoading && (
             <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          )}
          {messages && messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-3",
                getSender(message) === "me" ? "justify-end" : "justify-start"
              )}
            >
              {getSender(message) === "them" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatar} alt={message.name} />
                  <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs rounded-lg p-3 lg:max-w-md",
                  getSender(message) === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p className="mt-1 text-xs text-right opacity-70">
                   {message.timestamp?.toDate ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'sending...'}
                </p>
              </div>
              {getSender(message) === "me" && (
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
            disabled={!user}
          />
          <Button type="submit" size="icon" className="shrink-0" disabled={!user || newMessage.trim() === ""}>
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
