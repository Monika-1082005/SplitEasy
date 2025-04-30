import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faAngleDown
} from "@fortawesome/free-solid-svg-icons";

const faqData = [
  {
    question: "What is SplitEasy?",
    answer: "SplitEasy is a web platform that helps you split expenses with friends and track pending payments effortlessly.",
  },
  {
    question: "How do I add a new split?",
    answer: "Go to the 'Add Split' section, enter the total amount, add participants, and specify their share. The system will notify them automatically.",
  },
  {
    question: "Can I pay directly through SplitEasy?",
    answer: "Yes! We integrate with payment gateways like Razorpay to facilitate direct payments via UPI, Paytm, or Google Pay.",
  },
  {
    question: "How does SplitEasy track payments?",
    answer: "Once a payment is made, it updates the pending payments section. If you pay manually, you can mark it as paid.",
  },
  {
    question: "Will my friends get payment reminders?",
    answer: "Yes, SplitEasy sends email reminders to your friends for pending payments.",
  },
  {
    question: "Is SplitEasy free to use?",
    answer: "Yes, SplitEasy is free to use. Some advanced features may require premium access in the future.",
  },
  {
    question: "Can I settle payments partially?",
    answer: "Currently, full payments are tracked, but we are working on adding partial payments soon!",
  }
];


export default function FAQ(){

    const [activeIndex, setActiveIndex] = useState(null);
    
      const toggleAccordion = (index) => {
        setActiveIndex(activeIndex == index ? null : index);
      };
    return(
        <div className="bg-[#1F3C9A] px-5 py-5 md:py-10 ">
        <div className="flex justify-center p-4 text-lg md:text-3xl text-white">
          Frequently Asked Questions (FAQ)
        </div>
        <div className=" md:max-w-3xl mx-auto m-5 space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="p-2 md:p-4 bg-white cursor-pointer border rounded-xl shadow-md"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-lg font-semibold text-[#1d214b] ">{item.question}</h3>
                <span
                  className={`transition-transform ${
                    activeIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                <FontAwesomeIcon icon={faAngleDown} />
                </span>
              </div>
              {activeIndex === index && (
                <p className="mt-2 text-[#1F3C9A] text-sm md:text-md">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
}