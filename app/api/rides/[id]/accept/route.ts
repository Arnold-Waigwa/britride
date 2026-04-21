import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  //get the user information from sessions : we'll hardcode for now
  const acceptorId = 1; //later, we'll do logic to ensure a poster cannot be its own acceptor

  //get the ride id (must match the [id] folder name)
  const { id } = await params;

  //ensure there's id
  if (!id) {
    console.log("No ID provided");
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  // try to update
  try {
    const updatedRide = await prisma.ride.update({
      where: { id: parseInt(id) },
      data: { acceptorId: acceptorId },
    });

    // Return the updated data to the frontend
    return NextResponse.json(updatedRide, { status: 200 });
  } catch (error: any) {
    console.log(error, "Error Accepting Ride");
    return NextResponse.json(
      { error: "Failed to Accept ride", details: error.message },
      { status: 500 },
    );
  }
}
