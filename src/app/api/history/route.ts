import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { userId, chatId } = await req.json();

    if (!userId || !chatId) {
      return NextResponse.json(
        { error: "user_id and chat_id query parameters are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const collection = db.collection("messages");

    // Fetch messages: filter by user_id and chat_id, project only 'message', sort by message.id (sequential)
    const messagesCursor = await collection
      .find(
        { user_id: userId, chat_id: chatId },
        { projection: { message: 1 } }, // Only return the UIMessage object
      )
      .sort({ "message.id": 1 }) // Sort by original message id for order (e.g., "1", "2", ...)
      .toArray();

    // Extract the message objects into array
    const messages = messagesCursor.map((doc) => doc.message);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching messages" },
      { status: 500 },
    );
  }
}
