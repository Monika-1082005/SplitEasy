import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faAngleDown
} from "@fortawesome/free-solid-svg-icons";

const faqData = [
    {
      question: "What is React?",
      answer: "React is a JavaScript library for building user interfaces.",
    },
    {
      question: "What is JSX?",
      answer:
        "JSX is a syntax extension for JavaScript that looks similar to XML or HTML.",
    },
    {
      question: "What are React hooks?",
      answer:
        "Hooks let you use state and other React features without writing a class.",
    },
    {
        question: "What is React?",
        answer: "React is a JavaScript library for building user interfaces.",
      },
      {
        question: "What is JSX?",
        answer:
          "JSX is a syntax extension for JavaScript that looks similar to XML or HTML.",
      },
      {
        question: "What are React hooks?",
        answer:
          "Hooks let you use state and other React features without writing a class.",
      },
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