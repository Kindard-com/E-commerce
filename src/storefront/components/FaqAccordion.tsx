"use client";

import { useState } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {faqs.map((faq, index) => (
        <div className={`faq-item ${openIndex === index ? 'active' : ''}`} key={index}>
          <button className="faq-question" onClick={() => toggleFaq(index)} aria-expanded={openIndex === index}>
            {faq.question}
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
