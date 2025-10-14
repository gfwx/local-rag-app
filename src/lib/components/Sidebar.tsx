ai-chatbot/src/lib/components/Sidebar.tsx
import React from "react";
import { SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface Chat {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: Chat[];
  onSelect: (id: string) => void;
}

export function Sidebar({ chats, onSelect }: SidebarProps) {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton onClick={() => onSelect(chat.id)}>
                {chat.title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
