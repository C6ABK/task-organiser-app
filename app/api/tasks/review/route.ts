import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tasks = await prisma.task.findMany({
        where: {
            reviewOn: {lte: today},
            completed: false,
        },
        orderBy: { reviewOn: "asc"}
    })

    return NextResponse.json(tasks)
}