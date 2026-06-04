import { authOptions } from "@/app/auth";
import { pusherServer } from "@/lib/pusher/pusherServer";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  //if not logged in, reject
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.formData();
  const socket_id = body.get("socket_id") as string;
  const channel_name = body.get("channel_name") as string;

  //if not acceptor or poster, can't be in this private channel
  // Assume channel_name is like 'private-ride-123' or 'private-123'
  const rideIdStr = channel_name.split("-").pop();
  const rideId = Number(rideIdStr);
  if (Number.isNaN(rideId)) {
    return NextResponse.json(
      { error: "Invalid channel name" },
      { status: 400 },
    );
  }
  const rideConversation = await prisma.conversation.findUnique({
    where: { id: rideId },
    include: { ride: true },
  });

  if (!rideConversation) {
    return NextResponse.json({ error: "Ride does not exist" }, { status: 400 });
  }

  if (
    Number(session.user.id) !== rideConversation.ride.posterId &&
    Number(session.user.id) !== rideConversation.ride.acceptorId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name);
  return NextResponse.json(authResponse);
}
