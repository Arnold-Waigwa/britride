import { RideSchemaPost } from "@/app/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();

  const { id } = await params;

  if (!id) {
    console.log("No ID provided");
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  //if its an accept request, branch out

  if (body?.action === "ACCEPT") {
    const sessionUserId = /* mock for now */ 1;

    try {
      // atomic-ish: only update if status is still OPEN (prevents double-accept)
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

      // fetch and return the updated ride
      const updatedRide = await prisma.ride.findUnique({
        where: { id: parseInt(id) },
      });
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
