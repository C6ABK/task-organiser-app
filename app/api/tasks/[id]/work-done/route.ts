import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    try {
        // Verify the user owns the task
        const task = await prisma.task.findUnique({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        const workDone = await prisma.workDone.findMany({
            where: { taskId: id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ workDone })
    } catch (error) {
        console.error("Error fetching work done:", error)
        return NextResponse.json(
            { error: "Failed to fetch work done" },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    }

    try {
        const { description, hoursSpent } = await request.json()

        // Verify the user owns the task
        const task = await prisma.task.findUnique({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        const workDone = await prisma.workDone.create({
            data: {
                description,
                hoursSpent,
                taskId: id  // Note: taskId, not nextActionId
            }
        })

        return NextResponse.json({ workDone })
    } catch (error) {
        console.error("Error creating work done:", error)
        return NextResponse.json(
            { error: "Failed to create work done" },
            { status: 500 }
        )
    }
}