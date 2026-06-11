import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const parsedUserId = parseInt(userId);

    if (isNaN(parsedUserId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 },
      );
    }

    const notification = await prisma.notification.findMany({
      where: { userId: parsedUserId },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(notification, { status: 200 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 },
      );
    }

    const parsedUserId = parseInt(userId);

    await prisma.notification.deleteMany({
      where: { userId: parsedUserId },
    });

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("error deleting comment", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
