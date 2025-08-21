import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import CurrentActions from "../components/CurrentActions"
import CreateAction from "../components/CreateAction"

const DashboardPage = async () => {
    const session = await getServerSession()

    if (!session) {
        redirect("/signin")
    }

    return (
        <div className="w-full h-screen flex flex-col md:flex-row space-x-4">
            <div className="w-full">
                <CurrentActions />
            </div>
            <div className="w-full">
                <CreateAction />
            </div>
        </div>
    )
}
export default DashboardPage
