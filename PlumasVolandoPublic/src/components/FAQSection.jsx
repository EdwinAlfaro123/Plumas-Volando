import React from "react";
import { faqData } from "../data/faqData";

const FAQItemComponent = ({ faq }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="faq-q-icon">
          {/* Icono de ayuda */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <span className="faq-q-text">{faq.question}</span>
        <span className="faq-chevron">
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="faq-answer">
          <div className="faq-answer-image">
            <img src={faq.image} alt={faq.question} />
          </div>
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  return (
    <section className="faq-section">
      <h2>Preguntas Frecuentes</h2>
      <div className="faq-grid">
        {faqData.map((faq) => (
          <FAQItemComponent key={faq.id} faq={faq} />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;