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

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised"}, { status: 401 })
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                category: true
            },
            orderBy: [
                { status: 'asc' },      // PENDING first, IN_PROGRESS next, COMPLETED last
                { reviewOn: 'asc' },    // Then by reviewOn date (earliest first)
                { createdAt: 'desc' }   // Finally by creation date (newest first as tiebreaker)
            ]
        })

        return NextResponse.json({ tasks })
    } catch (error) {
        console.error("Error fetching tasks:", error)
        return NextResponse.json({ error: "Failed to fetch tasks" }, {status: 500 })
    }
}