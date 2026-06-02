import authOptions from "@/app/auth";
import { pusherServer } from "@/lib/pusher/pusherServer";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// { POST /messages body: {conversationId: "", etc..}}
export async function POST(request: NextRequest) {
  try {
    // 1. Get the current user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract data from request body
    const body = await request.json();
    const { content, conversationId } = body;

    if (!content || !conversationId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    //3. Save message in the database
    const newMessage = await prisma.message.create({
      data: {
        content,
        conversationId: parseInt(conversationId),
        senderId: parseInt(session.user.id),
      },
      include: {
        sender: true,
      },
    });

    //create event and push to channel
    const channelName = `private-conversation-${conversationId}`;
    await pusherServer.trigger(channelName, "new-message", newMessage);

    //return success
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("MESSAGE_CREATION_ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
