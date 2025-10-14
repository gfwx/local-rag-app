import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from "@/lib/providers/chatProvider";
import { AuthProvider } from "@/lib/providers/authProvider";
import { UIMessage } from "ai";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**
   * hardcoded stuff
   */

  /**
   * In a realistic scenario, the user object would be
   * fetched from the authentication server via middleware
   * the middleware would then propagate auth state to the app via layout.
   */
  const user = {
    id: process.env.DEMO_USER_ID,
  };

  /**
   * Same thing here
   */
  const chatId = "04fec424-0501-4ab0-b9fa-44a63b826849";

  let messages: UIMessage[] = [];
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    const response = await fetch(
      `${baseUrl}/api/db/messages?user_id=${user.id}&chat_id=${chatId}`,
      {
        method: "GET",
      },
    );

    if (response.ok) {
      const data = await response.json();
      messages = data.messages;
    }
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    messages = [];
  }
  return (
    <ChatProvider chatHistory={messages}>
      <AuthProvider user={user}>
        <html lang="en">
          <body>{children}</body>
        </html>
      </AuthProvider>
    </ChatProvider>
  );
}
