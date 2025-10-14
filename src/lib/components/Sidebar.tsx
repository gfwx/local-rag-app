"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/providers/authProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
}

export function ChatSidebar({ chats }: SidebarProps) {
  const [localChats, setLocalChats] = useState(chats || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();
  const pathname = usePathname();
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

  const handleDeleteChat = async (chatId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this chat? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/db/chats?user_id=${user.id}&chat_id=${chatId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      setLocalChats(localChats.filter((chat) => chat.id !== chatId));

      // If current route is this chat, redirect to home

      if (pathname.includes(`/chat/${chatId}`)) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat");
    }
  };

  const handleRenameChat = (chatId: string) => {
    const chat = localChats.find((c) => c.id === chatId);
    if (chat) {
      setNewTitle(chat.title);
      setEditingId(chatId);
    }
  };

  const saveRename = async (chatId: string) => {
    if (!newTitle.trim()) {
      setEditingId(null);
      return;
    }

    try {
      const response = await fetch(
        `/api/db/chats?user_id=${user.id}&chat_id=${chatId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to rename chat");
      }

      setLocalChats(
        localChats.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat,
        ),
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error renaming chat:", error);
      alert("Failed to rename chat");
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
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <Link href={`/chat/${chat.id}`}>
                        {editingId === chat.id ? (
                          <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={() => saveRename(chat.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveRename(chat.id);
                              } else if (e.key === "Escape") {
                                setEditingId(null);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <SidebarMenuButton>{chat.title}</SidebarMenuButton>
                        )}
                      </Link>
                    </ContextMenuTrigger>

                    <ContextMenuContent className="flex flex-col gap-2">
                      <ContextMenuItem
                        asChild
                        onClick={() => handleRenameChat(chat.id)}
                      >
                        <Button className="w-full" variant="outline">
                          Rename Chat
                        </Button>
                      </ContextMenuItem>

                      <ContextMenuItem
                        asChild
                        onClick={() => handleDeleteChat(chat.id)}
                      >
                        <Button className="w-full" variant="destructive">
                          Delete Chat
                        </Button>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
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
