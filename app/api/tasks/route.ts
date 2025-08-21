import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    console.log("Session:", session)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401})
    }

    try { 
        const { title, description, categoryId, priority, dueDate } = await request.json()

        const task = await prisma.task.create({
            data: {
                title, 
                description, 
                categoryId, 
                userId: session.user.id, 
                priority, 
                dueDate: dueDate ? new Date(dueDate) : null,
            }
        })

        return NextResponse.json({ task })
    } catch (error) {
        console.error("Error creating task:", error)
        return NextResponse.json({ error: "Failed to create task" }, { status: 500})
    }
}