import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
        const { title } = await request.json()

        // Verify task belongs to user
        const task = await prisma.task.findUnique({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!task) {
            return NextResponse.json({ error: "Task not found"}, { status: 404 })
        }

        const nextAction = await prisma.nextAction.create({
            data: {
                title,
                taskId: id
            }
        })

        return NextResponse.json({ nextAction })
    } catch (error) {
        console.error("Error creating next action:", error)
        return NextResponse.json(
            { error: "Failed to create next action" },
            { status: 500 }
        )
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorised " }, { status: 401 })
    }

    try {
        // Verify task belongs to user
        const task = await prisma.task.findUnique({
            where: {
                id: id,
                userId: session.user.id
            }
        })

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 })
        }

        const nextActions = await prisma.nextAction.findMany({
            where: { taskId: id },
            select: {
                id: true,
                title: true,
                completed: true,
                completedAt: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: [
                { completed: 'asc' },
                { createdAt: 'asc' }
            ]
        })

        return NextResponse.json({ nextActions })
    } catch (error) {
        console.error("Error fetching next actions:", error)
        return NextResponse.json(
            { error: "Failed to fetch next actions" },
            { status: 500 }
        )
    }
}

