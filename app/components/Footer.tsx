"use client"

import Link from "next/link"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-bold mb-4">Task Organiser</h3>
                        <p className="text-gray-300 text-sm">
                            A modern task management solution to organize your work and boost productivity.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">
                            Product
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    href="/dashboard" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/features" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/help" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/roadmap" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Roadmap
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">
                            Company
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    href="/about" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/blog" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/contact" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/careers" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">
                            Legal
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    href="/privacy" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/terms" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/cookies" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href="/security" 
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
                                >
                                    Security
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {currentYear} Task Organiser. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <a 
                            href="https://github.com/C6ABK/task-organiser-app" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            GitHub
                        </a>
                        <Link 
                            href="/changelog" 
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            v1.0.0
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer