import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">About the Ethiopia Orthodox Tewahedo Incident Hub</h1>
          <p className="mt-3 text-lg text-gray-600">A safe, confidential, and community-centered platform for reporting and tracking incidents within our church communities.</p>
        </header>

        {/* Hero card */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Our Purpose</h2>
              <p className="text-gray-700 leading-relaxed">The Ethiopia Orthodox Tewahedo Incident Hub exists to provide congregations, clergy, and church staff with a trusted place to report incidents — from safety concerns to misconduct — and to ensure transparent follow-up and community support. We aim to protect our members, strengthen accountability, and foster healing.</p>
            </div>

            <div className="w-full h-48 relative rounded-lg overflow-hidden">
              {/* Decorative image placeholder */}
              <Image
                src="/eotc.jpg"
                alt="Church logo"
                
               width={200}
               height={10}
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        <section className="grid gap-6 sm:grid-cols-3 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-2">Mission</h3>
            <p className="text-gray-700">To provide a compassionate, confidential and easy-to-use reporting system that empowers survivors and encourages responsible stewardship across our parishes and dioceses.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-2">Vision</h3>
            <p className="text-gray-700">A church community where every member feels safe, heard, and supported — where incidents are addressed promptly and justice, care and restoration are prioritized.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-2">Core Values</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Confidentiality & dignity</li>
              <li>Transparency & accountability</li>
              <li>Compassionate care</li>
              <li>Community-driven solutions</li>
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How the Incident Hub Works</h2>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium mb-2">1. Report</h4>
              <p className="text-gray-700">Submit an incident report through our secure form. You may remain anonymous. You can attach photos, files, and choose the category that best fits the incident.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium mb-2">2. Triage & Support</h4>
              <p className="text-gray-700">Reports are reviewed by the designated response team. Immediate risks are prioritized and survivors are connected to pastoral and practical support resources.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium mb-2">3. Investigation & Follow-up</h4>
              <p className="text-gray-700">Where needed, investigations are launched following church protocols. The reporting party will receive updates, while confidentiality and due process are maintained.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-medium mb-2">4. Resolution & Prevention</h4>
              <p className="text-gray-700">Cases are resolved with actions that may include mediation, disciplinary measures, policy updates, or training to prevent recurrence.</p>
            </div>
          </div>
        </section>

        {/* Confidentiality & Data */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Confidentiality & Data Protection</h2>
          <p className="text-gray-700 mb-3">We treat all reports with the utmost confidentiality. Personal data is stored securely and access is limited to authorized response team members only. We comply with applicable laws and church policies governing data protection.</p>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h4 className="font-medium mb-2">Your choices</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>You can submit reports anonymously.</li>
              <li>You control what files or photos you share.</li>
              <li>We will only share personal details with parties directly involved in handling the case unless legally required otherwise.</li>
            </ul>
          </div>
        </section>

        {/* Who we are */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700">The Incident Hub is stewarded by a cross-diocesan team that includes clergy, lay leaders, and trained safeguarding officers. Our members follow the traditions of the Ethiopia Orthodox Tewahedo Church and are committed to pastoral care, justice, and the well-being of all congregants.</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-medium">Lead Coordinator</p>
                <p className="text-gray-600">Mr. Someone B.</p>
              </div>
              <div>
                <p className="font-medium">Safeguarding Officer</p>
                <p className="text-gray-600">Mr. Someone A.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & CTA */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Contact & Support</h2>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-1">
              <p className="text-gray-700 mb-3">If you need immediate help or to speak with someone, please contact your local parish leadership or use the emergency contact below.</p>
              <ul className="text-gray-700 list-none space-y-2">
                <li><span className="font-medium">Emergency contact:</span> +251 9XX XXX XXX</li>
                <li><span className="font-medium">Email:</span> <a href="mailto:incidents@orthodoxhub.et" className="text-blue-600 hover:underline">incidents@gmail.com</a></li>
              </ul>
            </div>

            <div className="w-full sm:w-56">
              <a href="/report" className="inline-block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">Report an Incident</a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="bg-white p-4 rounded-lg border border-gray-100">
              <summary className="cursor-pointer font-medium">Can I report anonymously?</summary>
              <p className="mt-2 text-gray-700">Yes. You may submit a report without identifying yourself. Note that anonymous reports can limit follow-up actions that require contact.</p>
            </details>

            <details className="bg-white p-4 rounded-lg border border-gray-100">
              <summary className="cursor-pointer font-medium">Who will see my report?</summary>
              <p className="mt-2 text-gray-700">Only authorized response team members and, when necessary, relevant parish leaders will view the report. We do not publish identifying details publicly.</p>
            </details>

            <details className="bg-white p-4 rounded-lg border border-gray-100">
              <summary className="cursor-pointer font-medium">How long does it take to get a response?</summary>
              <p className="mt-2 text-gray-700">We aim to acknowledge receipt within 72 hours for non-emergency reports. For urgent safety concerns, please use the emergency contact immediately.</p>
            </details>
          </div>
        </section>

        {/* Footer note */}
        <footer className="text-center text-sm text-gray-500 pb-8">
          <p>© {new Date().getFullYear()} Ethiopia Orthodox Tewahedo Incident Hub — A ministry-supported initiative dedicated to safety and care.</p>
        </footer>
      </div>
    </main>
  )
}
