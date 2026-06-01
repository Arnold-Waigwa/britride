import { RideSchemaPost } from "@/app/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await request.json(); //parse the json and convert to object
  //validate the request
  const validation = RideSchemaPost.safeParse(response);

  //if validation is falsy
  if (!validation.success) {
    return NextResponse.json(validation.error, { status: 400 });
  }
  //after accepted validation, update changes on database
  try {
    const newRide = await prisma.ride.create({
      data: {
        title: validation.data.title,
        description: validation.data.description,
        location: validation.data.location,
        price: validation.data.price,
        posterId: parseInt(session.user.id),
      },
    });
    return NextResponse.json(newRide, { status: 201 });
  } catch (error: any) {
    console.error("DATABASE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create ride", details: error.message },
      { status: 500 },
    );
  }
}
