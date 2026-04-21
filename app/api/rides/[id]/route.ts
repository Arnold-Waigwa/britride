import { RideSchemaPost } from "@/app/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  //we can do logic to get the user in sessions or jwt
  //validate the body
  const validate = RideSchemaPost.safeParse(body);

  //if not valid return json error
  if (!validate.success) {
    return NextResponse.json(validate.error, { status: 400 });
  }

  //try patching the id
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

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
