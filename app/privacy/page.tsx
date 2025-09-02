export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="prose prose-gray max-w-none">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                
                <p className="text-gray-600 mb-6">
                    <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
                    <p className="text-gray-600 mb-4">
                        We collect information you provide directly to us when using Task Organiser, including:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li>Account information (email, name)</li>
                        <li>Task and project data you create</li>
                        <li>Usage analytics to improve our service</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
                    <p className="text-gray-600 mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li>Provide and maintain our service</li>
                        <li>Process your tasks and data</li>
                        <li>Send important updates about the service</li>
                        <li>Improve our features and user experience</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
                    <p className="text-gray-600">
                        We implement appropriate security measures to protect your personal information. 
                        Your data is encrypted in transit and at rest. We use industry-standard security 
                        practices to safeguard your information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
                    <p className="text-gray-600 mb-4">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Delete your account and data</li>
                        <li>Export your data</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                    <p className="text-gray-600">
                        If you have any questions about this Privacy Policy, please contact us at{" "}
                        <a href="mailto:privacy@taskorganiser.com" className="text-blue-600 hover:underline">
                            privacy@taskorganiser.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    )
}