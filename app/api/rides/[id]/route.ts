import { NextRequest, NextResponse } from "next/server";
import { RideSchemaPost } from "@/app/ValidationSchema";
import prisma from "@/prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}
export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();

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
