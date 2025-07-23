import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg">
                Task Organiser
            </Link>
            <div>
                <Link href="/signup" className="px-4 py-2 rounded hover:bg-gray-800">
                    Sign Up
                </Link>
                <Link href="/signin" className="px-4 py-2 rounded hover:bg-gray-800">
                    Sign In
                </Link>
            </div>
        </nav>
    )
}
export default Navbar
