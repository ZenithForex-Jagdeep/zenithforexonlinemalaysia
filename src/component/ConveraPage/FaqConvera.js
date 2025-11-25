"use client";
import React from "react";

const faqs = [
    {
        question: "What is Convera and how does it work for paying international fees?",
        answer: "Convera is a global payments platform (formerly Western Union Business Solutions) that enables cross-border transfers like tuition payments. It partners with banks, institutions, and platforms to let users send money internationally in a secure, regulated way.",
    },
    {
        question: "How is Convera more beneficial than a regular bank transfer for forex payments?",
        answer: "• Better exchange rates and lower margins in many cases\n• Transparent fees and real-time tracking\n• Greater global reach and reliability\n• Built for cross-border payments (not just domestic banking)",
    },
    {
        question: "What currencies and countries does Convera support?",
        answer: "Convera supports transactions in many currencies and has reach across over 200 countries and territories.",
    },
    {
        question: "How long does it take for a payment via Convera to reach the recipient?",
        answer: "Payment timelines can vary depending on the destination country, the banking system, and accuracy of details. Typically, it may take 3-5 business days or more.",
    },
    {
        question: "What happens if I enter incorrect bank or beneficiary details?",
        answer: "If you provide incorrect information (wrong name, bank code, account number), the payment may be delayed or rejected. You’ll need to contact Convera support or the beneficiary institution to correct it.",
    },
    {
        question: "Are there fees or charges when using Convera?",
        answer: "Yes — there may be processing fees, exchange rate margins, or intermediary bank charges. The total cost depends on currency pair, amount, and route. Always check the fees and exchange rate before confirming your transaction.",
    },
    {
        question: "Can I use Convera to pay my overseas university / tuition fees?",
        answer: "Yes — Convera supports international education payments in cooperation with educational institutions, giving students a reliable option to pay fees abroad.",
    },
    {
        question: "Can I track my payment and get notifications with Convera?",
        answer: "Yes, Convera generally sends a payment confirmation (via email or within the portal) when you initiate the transaction. You can then track status until settlement.",
    },
    {
        question: "What is a forex / outward remittance, and are there regulatory limits in India?",
        answer: "A forex / outward remittance is sending money from India abroad (e.g. for tuition, gifts, investments). Under Indian regulations (Liberalised Remittance Scheme), resident individuals may remit up to USD 250,000 per calendar year for permitted purposes.",
    },
    {
        question: "What alternatives exist to forex cards for international travel / payments?",
        answer: "• Currency exchange: Buy foreign currency notes or travelers’ cheques via banks or authorized dealers\n• Forex / prepaid cards: Preloaded cards in foreign currencies, usable abroad\n• Regular bank wire / bank transfer: Via SWIFT / overseas banking networks\n• Online money transfer / remittance services (like Convera, Wise, etc.)",
    },
];

const FaqConvera = () => {
    return (
        <div className="bg-light py-5">
            <div className="container">
                <h1 className="text-center fw-bold mb-5" style={{ color: "#1761AE" }}>
                    Frequently Asked Questions
                </h1>

                <div className="row">
                    {faqs.map((faq, index) => (
                        <div className="col-12 col-md-6 mb-4" key={index}>
                            <div className="accordion shadow-sm" id={`faqAccordion${index}`}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id={`heading${index}`}>
                                        <button
                                            className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                            aria-expanded={index === 0 ? "true" : "false"}
                                            aria-controls={`collapse${index}`}
                                            style={{ fontSize: "1rem" }}
                                        >
                                            {faq.question}
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse${index}`}
                                        className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                        aria-labelledby={`heading${index}`}
                                        data-bs-parent={`#faqAccordion${index}`}
                                    >
                                        <div className="accordion-body" style={{ whiteSpace: "pre-line" }}>
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaqConvera;
