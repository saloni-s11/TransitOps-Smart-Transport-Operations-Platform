import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";

const FAQS = [
  {
    q: "How do I add a new vehicle to the fleet?",
    a: "Navigate to Fleet → Add Vehicle from the sidebar. Fill in the registration number, model, type, capacity, odometer reading, and acquisition cost. Only Fleet Managers have permission to add vehicles.",
  },
  {
    q: "Why is a vehicle not appearing in the Trip Dispatcher?",
    a: "Only vehicles with status 'Available' appear in the dispatch pool. Vehicles marked as 'In Shop', 'On Trip', or 'Retired' are automatically excluded to prevent assignment errors.",
  },
  {
    q: "How do I complete or cancel an active trip?",
    a: "Open the Trips page and locate the trip in the Live Board. Hover over the trip row to reveal the Complete (✓) and Cancel (✗) action buttons. These actions are restricted to Dispatchers and Fleet Managers.",
  },
  {
    q: "A driver is blocked from being assigned to a trip. Why?",
    a: "Drivers are blocked from dispatch if their license has expired or their status is 'Suspended' or 'Off Duty'. Update the driver's status on the Drivers page, or renew their license details.",
  },
  {
    q: "How do I log a fuel fill or expense?",
    a: "Go to Fuel & Expenses and click 'Log Fuel' or 'Add Expense'. You can optionally link the entry to a vehicle and trip. This module is accessible to Financial Analysts and Fleet Managers.",
  },
  {
    q: "I can't see certain pages in the sidebar. Is that normal?",
    a: "Yes. The sidebar only shows pages your role has access to. TransitOps uses role-based access control — each role sees only the modules relevant to their responsibilities. Contact your Fleet Manager to request a role change.",
  },
  {
    q: "How does the maintenance workflow affect vehicle availability?",
    a: "Logging a service record immediately sets the vehicle's status to 'In Shop', removing it from dispatch. Clicking 'Mark Complete' on the record restores the vehicle to 'Available'.",
  },
  {
    q: "Can I export data from the Reports page?",
    a: "Yes. The Reports & Analytics page has an 'Export PDF' button available to Fleet Managers and Financial Analysts. Maintenance logs on the Maintenance page can also be exported as CSV.",
  },
];

const SYSTEM_CHECKS = [
  { label: "Application", status: "Operational" },
  { label: "Database (Supabase)", status: "Operational" },
  { label: "Authentication", status: "Operational" },
  { label: "Fleet Sync", status: "Operational" },
];

const QUICK_LINKS = [
  { label: "Add Vehicle", icon: "add_circle", href: "/vehicles/add", desc: "Register a new fleet asset" },
  { label: "Dispatch Trip", icon: "rocket_launch", href: "/trips", desc: "Create and dispatch a trip" },
  { label: "Log Fuel", icon: "local_gas_station", href: "/fuel-expenses", desc: "Record a fuel fill" },
  { label: "View Reports", icon: "analytics", href: "/reports", desc: "Analytics and export" },
];

export default function Support() {
  const { role } = useAppData();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ subject: "", message: "", priority: "Normal" });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ subject: "", message: "", priority: "Normal" });
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Help & Support</h1>
          <p className="text-body-md text-secondary mt-1">
            Find answers, submit a request, or check system status.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
          <span className="text-body-sm font-semibold text-green-700">All Systems Operational</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="bg-white border border-outline-variant rounded-xl p-5 flex flex-col gap-3 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
            </div>
            <div>
              <p className="text-body-md font-bold text-on-surface">{link.label}</p>
              <p className="text-body-sm text-secondary">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FAQ — left 2 columns */}
        <section className="lg:col-span-2 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">help</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-outline-variant">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-container-lowest transition-colors group"
                >
                  <span className="text-body-md font-semibold text-on-surface pr-4">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-secondary shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180 text-primary" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-body-md text-secondary leading-relaxed border-l-2 border-primary-container pl-4">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Right column — System Status + Contact */}
        <div className="flex flex-col gap-6">

          {/* System Status */}
          <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitor_heart</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">System Status</h2>
            </div>
            <div className="p-5 space-y-3">
              {SYSTEM_CHECKS.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-body-md text-secondary">{item.label}</span>
                  <span className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 text-label-caps font-bold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <p className="text-body-sm text-secondary italic">
                Last checked: just now &nbsp;·&nbsp; Uptime: 99.9%
              </p>
            </div>
          </section>

          {/* Role info card */}
          <section className="bg-primary-container/20 border border-primary-container rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">manage_accounts</span>
            </div>
            <div>
              <p className="text-body-md font-bold text-on-surface mb-0.5">Your Role</p>
              <p className="text-label-caps font-bold text-primary uppercase tracking-wide">{role}</p>
              <p className="text-body-sm text-secondary mt-1">
                Some features are restricted based on your role. Contact your Fleet Manager to request elevated access.
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* Contact / Ticket Form */}
      <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">support_agent</span>
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Submit a Support Request</h2>
            <p className="text-body-sm text-secondary mt-0.5">
              Describe your issue and a team member will respond within 24 hours.
            </p>
          </div>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div>
                <p className="text-headline-sm font-bold text-on-surface">Request Submitted</p>
                <p className="text-body-md text-secondary mt-1">
                  We've received your request and will follow up shortly.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-label-caps font-label-caps text-secondary uppercase mb-1.5">
                    Subject <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={set("subject")}
                    placeholder="e.g. Vehicle not appearing in dispatch pool"
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-body-md bg-background focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-label-caps font-label-caps text-secondary uppercase mb-1.5">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={set("priority")}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-body-md bg-background focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none appearance-none"
                  >
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-label-caps font-label-caps text-secondary uppercase mb-1.5">
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  rows={5}
                  placeholder="Describe the issue in detail — what you were doing, what you expected, and what happened instead..."
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-body-md bg-background focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none resize-none"
                  required
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-secondary text-body-sm">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  Your role ({role}) and depot info will be included automatically.
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white font-bold px-8 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Request
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer contact strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-outline-variant rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-tertiary-container">mail</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-secondary uppercase">Email Support</p>
            <p className="text-body-md font-semibold text-on-surface">support@transitops.io</p>
          </div>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-secondary-container">menu_book</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-secondary uppercase">Documentation</p>
            <p className="text-body-md font-semibold text-on-surface">docs.transitops.io</p>
          </div>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">schedule</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-secondary uppercase">Response Time</p>
            <p className="text-body-md font-semibold text-on-surface">Within 24 hours</p>
          </div>
        </div>
      </div>

    </div>
  );
}
