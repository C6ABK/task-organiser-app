"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import CurrentActions from "../components/CurrentActions"
import CreateAction from "../components/CreateAction"

const DashboardPage = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return
        if (!session) router.push("/signin")
    }, [session, status, router])

    const handleTaskCreated = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (!session) {
        return <div>Redirecting...</div>
    }

    return (
        <div className="w-full h-screen flex flex-col md:flex-row space-x-4">
            <div className="w-full">
                <CurrentActions key={refreshTrigger} />
            </div>
            <div className="w-full">
                <CreateAction onTaskCreated={handleTaskCreated} />
            </div>
        </div>
    )
}
export default DashboardPage
