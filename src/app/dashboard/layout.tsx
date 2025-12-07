"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Calendar, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const auth = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  const menuItems = [
    {
      href: "/dashboard/chat",
      label: "Chat",
      icon: MessageSquare,
    },
    {
      href: "/dashboard/calendar",
      label: "Calendar",
      icon: Calendar,
    },
    {
      href: "/dashboard/ai-tools",
      label: "Date Ideas",
      icon: Sparkles,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <span className="font-headline text-xl font-semibold">Forever Us</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <div className="p-4">
           <Link href="/login" onClick={handleLogout}>
              <Button variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </Link>
        </div>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
