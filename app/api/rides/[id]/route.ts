import { authOptions } from "@/app/auth";
import { RideSchemaPost } from "@/app/ValidationSchema";
import { pusherServer } from "@/lib/pusher/pusherServer";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  const body = await request.json();

  const { id } = await params;

  if (!id) {
    console.log("No ID provided");
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  //if its an accept request, branch out

  if (body?.action === "ACCEPT") {
    const sessionUserId = Number(session?.user.id);

    try {
      const result = await prisma.ride.updateMany({
        where: { id: parseInt(id), status: "OPEN" },
        data: { acceptorId: sessionUserId, status: "ACCEPTED" },
      });

      if (result.count === 0) {
        // either ride not found or already accepted
        const maybeRide = await prisma.ride.findUnique({
          where: { id: parseInt(id) },
        });
        if (!maybeRide)
          return NextResponse.json(
            { error: "Ride not found" },
            { status: 404 },
          );
        return NextResponse.json(
          { error: "Ride already accepted or cannot accept" },
          { status: 409 },
        );
      }

      // Automatically create the conversation and link it.
      const updatedRide = await prisma.ride.update({
        where: { id: parseInt(id) },
        data: {
          conversation: {
            create: {},
          },
        },
        include: { conversation: true },
      });

      await prisma.notification.create({
        data: { kind: "ACCEPTED_RIDE", userId: updatedRide.posterId },
      });

      //Trigger accepted event to client
      const channelName = `accepted-${updatedRide.posterId}`;
      console.log("Triggering on channel:", channelName);
      console.log(
        "posterId type:",
        typeof updatedRide.posterId,
        updatedRide.posterId,
      );
      await pusherServer.trigger(channelName, "accepted", updatedRide);

      return NextResponse.json(updatedRide, { status: 200 });
    } catch (err: any) {
      console.error("accept error", err);
      return NextResponse.json(
        { error: "Failed to accept ride", details: err.message },
        { status: 500 },
      );
    }
  } else {
    //validate the body
    const validate = RideSchemaPost.safeParse(body);

    //if not valid return json error
    if (!validate.success) {
      return NextResponse.json(validate.error, { status: 400 });
    }

    //try patching the id

    try {
      const updatedRide = await prisma.ride.update({
        where: { id: parseInt(id) },
        data: {
          title: validate.data.title,
          location: validate.data.location,
          description: validate.data.description,
          price: validate.data.price,
        },
      });
      return NextResponse.json(updatedRide, { status: 200 });
    } catch (err: any) {
      console.error("error", err);
      return NextResponse.json(
        { error: "Failed to update ride", details: err.message },
        { status: 500 },
      );
    }
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  try {
    await prisma.ride.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.log("Error deleting ride", err);
    return NextResponse.json(
      { error: "Error deleting ride", details: err.message },
      { status: 500 },
    );
  }
}
