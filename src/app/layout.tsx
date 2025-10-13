import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/lib/providers/chatProvider";
import { UIMessage } from "ai";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages: UIMessage[] = [
    {
      id: "1",
      role: "system",
      parts: [{ type: "text", text: "You are a helpful AI assistant." }],
    },
    {
      id: "2",
      role: "user",
      parts: [{ type: "text", text: "Hello!" }],
    },
    {
      id: "3",
      role: "assistant",
      parts: [{ type: "text", text: "Hi there! How can I help you today?" }],
    },
    {
      id: "4",
      role: "user",
      parts: [{ type: "text", text: "Can you tell me a fun fact?" }],
    },
    {
      id: "5",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Sure! Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are still perfectly edible.",
        },
      ],
    },
    {
      id: "6",
      role: "user",
      parts: [{ type: "text", text: "That’s interesting." }],
    },
    {
      id: "7",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "It really is! Would you like to hear another one?",
        },
      ],
    },
  ];
  return (
    <ChatProvider chatHistory={messages}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ChatProvider>
  );
}
