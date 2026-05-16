import { RegisterSchema } from "@/app/ValidationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest){
    const body = await request.json(); //extract the request body
    const validation = RegisterSchema.safeParse(body); //validate through zod

    //if invalid, return error FIRST! (Before trying to use validation.data)
    if (!validation.success) {
        return NextResponse.json(validation.error, {status: 400})
    }

    // Now it's safe to extract the data because validation was successful
    const {name, email, password} = validation.data

    //if valid, check that new user isn't present through google
    const existing = await prisma.user.findUnique({where: {email}})

    //if present, throw an email exists error
    if (existing) return NextResponse.json({error: "User is already associated with an email"}, {status: 409})


    //otherwise if valid, hash the password using bcrypt and store the new user
    const hashedPassword = await bcrypt.hash(password, 12)

    //store the user with hashed credentials
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    // Don't send the password back to the frontend!
    return NextResponse.json(
        { id: newUser.id, name: newUser.name, email: newUser.email }, 
        {status: 201}
    )
}