import { RegisterSchema } from "@/app/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const body = await request.json(); //extract the request body
  const validation = RegisterSchema.safeParse(body); //validate through zod

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { name, email, password } = validation.data;

  //if valid, check that new user isn't present through google
  const existing = await prisma.user.findUnique({ where: { email } });

  //if present, throw an email exists error
  if (existing)
    return NextResponse.json(
      { error: "User is already associated with an email" },
      { status: 409 },
    );

  //otherwise if valid, hash the password using bcrypt and store the new user
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (e: any) {
    console.error("BCRYPT ERROR:", e);
    return NextResponse.json(
      { error: "Failed to hash password", details: e.message },
      { status: 500 },
    );
  }

  //store the user with hashed credentials
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { id: newUser.id, name: newUser.name, email: newUser.email },
      { status: 201 },
    );
  } catch (e: any) {
    console.error("PRISMA CREATE ERROR:", e);
    return NextResponse.json(
      { error: "Failed to create user", details: e.message },
      { status: 500 },
    );
  }
}
