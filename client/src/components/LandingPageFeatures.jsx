import { motion } from "framer-motion";

export default function LandingPageFeatures() {
  const features = [
    {
      icon: "🧾",
      title: "Effortless Expense Splitting",
      description:
        "Quickly divide bills among friends or groups with just a few clicks.",
    },
    {
      icon: "🔔",
      title: "Smart Email Reminders",
      description:
        "Automatically reminds friends about pending payments—no awkward follow-ups.",
    },
    {
      icon: "🧮",
      title: "Track Who Owes What",
      description:
        "Keep a clear record of who owes whom and how much in every group.",
    },
    {
      icon: "📊",
      title: "Transparent Expense History",
      description:
        "View complete logs of past expenses, settlements, and payment statuses.",
    },
    {
      icon: "🌐",
      title: "Access Anytime, Anywhere",
      description:
        "Your data is cloud-based, accessible from any device, any time.",
    },
    {
      icon: "👥",
      title: "Simplified Group Management",
      description:
        "Create and manage multiple groups for trips, roommates, events, and more.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-[#9DC3ED] py-20 px-4 md:px-16 shadow-[0_-5px_10px_rgba(0,0,0,0.1)]
"
    >
      {/* Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto overflow-x-hidden">
        <motion.h2
          className="text-4xl font-bold text-[#1f3c9a]"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ amount: 0.4 }}
        >
          Features That Make SplitEasy Stand Out
        </motion.h2>
        <motion.p
          className="mt-4 text-md text-[#1D214B]"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          viewport={{ amount: 0.4 }}
        >
          Everything you need to split smarter, stay organized, and avoid
          awkward money talks.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-lg shadow-md px-6 py-8 text-center bg-white"
          >
            {/* Glowing Icon */}
            <div className="flex justify-center mb-4 border-b-blue-500">
              <div
                className="w-14 h-14 text-2xl flex items-center justify-center rounded-full bg-blue-100"
                style={{
                  boxShadow:
                    "inset 0 2px 6px rgba(31, 60, 154, 0.3), 0 4px 12px rgba(29, 33, 75, 0.5)",
                }}
              >
                {feature.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[#1F3C9A] mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-700">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
