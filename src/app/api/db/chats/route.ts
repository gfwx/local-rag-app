import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user id!" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection("chats");

    const chatsCursor = await collection.find({ user_id: userId }).toArray();

    const chats = chatsCursor.map((chat) => ({
      id: chat._id.toString(),
      title: chat.title,
      updated: chat.updatedAt,
    }));

    return NextResponse.json({ chats });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user id!" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection("chats");

    const chat = await collection.insertOne({
      user_id: userId,
      title: "New Chat",
      messages: [],
    });

    return NextResponse.json({ id: chat.insertedId.toString() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
