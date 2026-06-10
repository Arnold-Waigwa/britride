import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // GET requests usually pass data via search params, not a body
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

    // Use findFirst instead of findUnique because userId might not be unique
    const notification = await prisma.notification.findMany({
      where: { userId: parsedUserId },
      orderBy: { id: "desc" }, // Usually you want the most recent notification
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
