import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

// Env vars (fallback to local URI)
const uri =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=ai-chatbot";
const dbName = process.env.MONGODB_DB_NAME || "chatbot";

// Hardcoded messages from layout.tsx (strict UIMessage schema)
const predefinedMessages: any[] = [
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
        text: `It really is! Would you like to hear another one?
Alright, let me tell you a long, elaborate story to really test your app's handling of very large messages.
Once upon a time, in a distant land filled with rolling hills, vast forests, and sparkling rivers, there lived a community of people who were fascinated by the mysteries of the universe. Every day, they would gather in the central square to discuss ideas, inventions, and stories passed down from generations. Among them was an elder named Aurelius, known for his wisdom and his ability to weave tales that spanned days in length, each sentence building upon the last with layers of complexity and imagination. One morning, Aurelius began to recount the journey of a small, curious fox who ventured far beyond the known borders of the land. This fox encountered countless creatures, some friendly, some deceptive, and each encounter taught a lesson about courage, empathy, and the delicate balance between freedom and responsibility. The tale went on to describe the fox's travels through mountains so tall their peaks touched the clouds, deserts where the sand shimmered like gold, and oceans so deep that even the bravest of sailors feared to dive. Along the way, the fox discovered hidden civilizations, ancient libraries filled with scrolls of forgotten knowledge, and enchanted forests where the trees whispered secrets in languages only the heart could understand. As the story unfolded, Aurelius meticulously detailed each moment, every thought, every sensation, creating a narrative so rich and immersive that the listeners felt as though they were living the fox’s journey themselves. Days passed, and the people were enthralled, hanging on to every word, marveling at the sheer volume of events, characters, and reflections presented. This story, filled with twists, turns, philosophical musings, and colorful descriptions, was so long that it seemed endless, testing the patience, memory, and attention of those who heard it. And yet, each person found value in the journey, realizing that even the longest tale can provide insights, provoke thought, and inspire creativity in ways short stories never could.
By the time Aurelius finished, the sun had set, the moon had risen, and the square was silent, everyone lost in their own reflections of the vast, incredible world the fox had explored.`,
      },
    ],
  },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    // Step 1: Create 1 user
    const userId = uuidv4();
    const user = {
      id: userId,
      username: "demo",
      email: "demo@example.com",
      createdAt: new Date(),
    };
    const userResult = await db.collection("users").insertOne(user);
    console.log("Inserted user:", user.id);

    // Step 2: Create 3 chats with same timestamp
    const now = new Date(); // Same time for all
    const chatTitles = ["Chat 1", "Chat 2", "Chat 3"];
    const chats = chatTitles.map((title) => ({
      id: uuidv4(),
      user_id: userId,
      title,
      createdAt: now,
      updatedAt: now,
    }));
    const chatResult = await db.collection("chats").insertMany(chats);
    console.log(
      "Inserted chats:",
      chats.map((c) => c.id),
    );

    const firstChatId = chats[0].id;

    // Step 3: Create messages collection - one doc per predefined message
    const messagesToInsert = predefinedMessages.map((msg) => ({
      id: uuidv4(),
      message: msg, // Full UIMessage object
      user_id: userId,
      chat_id: firstChatId,
    }));
    const messageResult = await db
      .collection("messages")
      .insertMany(messagesToInsert);
    console.log(
      "Inserted messages:",
      messagesToInsert.length,
      "docs for chat:",
      firstChatId,
    );

    console.log("Seeding complete: 1 user, 3 chats, 7 messages inserted.");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export { seed };
