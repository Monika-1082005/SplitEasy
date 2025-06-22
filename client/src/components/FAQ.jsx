import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "What is SplitEasy?",
    answer:
      "SplitEasy is a simple web platform that helps you split expenses with group members and keep track of payments effortlessly.",
  },
  {
    question: "Is SplitEasy free to use?",
    answer:
      "Yes! SplitEasy is completely free to use with all features available to everyone.",
  },
  {
    question: "Do group members need SplitEasy accounts to view splits?",
    answer:
      "No, group members do not have access to the splits you create. Each person manages and views their own splits independently in their account.",
  },
  {
    question: "Will group members get payment reminders?",
    answer:
      "Yes, SplitEasy sends email reminders to group members at the intervals you set. You can also choose not to send any reminders at all—it's completely up to you.",
  },
  {
    question: "Can I manage multiple groups and track their expenses easily?",
    answer:
      "Absolutely! You can create and manage multiple groups for different occasions like trips, roommates, and events.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex == index ? null : index);
  };
  return (
    <div
      id="faq"
      className="px-5 py-3 md:py-10 min-h-screen shadow-[0_-5px_10px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center
"
    >
      <div className="flex justify-center p-4 text-lg md:text-3xl">
        Frequently Asked Questions (FAQ)
      </div>
      <div className=" w-full md:max-w-3xl mx-auto m-5 space-y-4">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            className="p-2 md:p-4 bg-white  border rounded-xl shadow-md"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center text-left cursor-pointer"
            >
              <h3 className="text-sm md:text-lg font-semibold text-[#1d214b] ">
                {item.question}
              </h3>
              <span
                className={`transition-transform ${
                  activeIndex === index ? "rotate-180" : "rotate-0"
                }`}
              >
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="cursor-pointer"
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {activeIndex === index && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden text-[#1F3C9A] text-sm sm:text-base md:text-lg mt-2 leading-relaxed"
                >
                  <p>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
