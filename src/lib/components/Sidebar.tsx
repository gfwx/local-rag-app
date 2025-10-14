"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/authProvider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
}

export function ChatSidebar({ chats }: SidebarProps) {
  const [localChats, setLocalChats] = useState(chats || []);
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    setLocalChats(chats || []);
  }, [chats]);

  const createNewChat = async () => {
    try {
      const response = await fetch(`/api/db/chats?user_id=${user.id}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      const data = await response.json();
      const newChatId = data.id;
      const newChat = { id: newChatId, title: "New Chat" };
      setLocalChats([newChat, ...localChats]);
      router.push(`/chat/${newChatId}`);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {localChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <Link href={`/chat/${chat.id}`}>
                    <SidebarMenuButton>{chat.title}</SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto">
          <Button onClick={createNewChat} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
