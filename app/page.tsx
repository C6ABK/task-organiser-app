export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Chaos into Clarity
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A full-stack task management platform that helps you break down
            complex projects into actionable steps. Built with modern web
            technologies to demonstrate production-ready development practices.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </a>
            <a
              href="https://github.com/C6ABK/task-organiser-app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Smart Task Organization
            </h3>
            <p className="text-gray-600">
              Manage projects with priority levels, due dates, and custom
              categories. Track progress with real-time status updates from
              pending through completion.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Next Actions System
            </h3>
            <p className="text-gray-600">
              Break down overwhelming tasks into concrete next steps. Each
              action is trackable, with completion timestamps and progress
              indicators that keep you moving forward.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Work Logging & Time Tracking
            </h3>
            <p className="text-gray-600">
              Document your progress with detailed work entries. Optional time
              tracking helps analyze how effort is distributed across tasks and
              actions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Secure & Isolated
            </h3>
            <p className="text-gray-600">
              Built with NextAuth.js for enterprise-grade authentication.
              Complete user isolation ensures data privacy with protected API
              routes throughout.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Highlights Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Technical Highlights
        </h2>

        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Built With Modern Tools
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              • Next.js 13+ App Router with TypeScript for type-safe development
            </li>
            <li>• PostgreSQL + Prisma ORM for robust data management</li>
            <li>• Tailwind CSS for responsive, mobile-first design</li>
            <li>• NextAuth.js for secure session management</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Production-Ready Architecture
          </h3>
          <p className="text-gray-600">
            RESTful API design with protected routes, optimistic UI updates, and
            confirmation modals for critical actions. Fully responsive across
            devices with intuitive navigation patterns.
          </p>
        </div>
      </section>
    </main>
  );
}
