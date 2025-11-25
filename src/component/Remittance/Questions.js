import React, { useState } from 'react';

function FAQAccordion({ branchName }) {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // -------- DEFAULT FAQ (if no matching branchName) ----------
  const defaultFAQItems = [
    {
      question: 'How long does it take to process a money transfer through Zenith Forex Online?',
      answer:
        'The processing time depends on transfer type, destination country, and method. It may take from a few minutes to a few business days.',
    },
    {
      question: 'Are there any limits on the transfer amount?',
      answer:
        'Yes, limits vary depending on destination and regulations. Verified customers can access higher limits.',
    },
    {
      question: 'What currencies can I transfer through Zenith Forex Online?',
      answer:
        'Most major currencies including USD, EUR, GBP, JPY, AUD, and others are supported.',
    },
    {
      question: 'How do I track my money transfer status?',
      answer:
        'A unique transaction ID is provided to track your transfer through your Zenith Forex Online account.',
    },
  ];

  // --------- CITY-SPECIFIC FAQ DATA --------------
  const faqData = {
    HYDERABAD: [
      {
        question: "What is foreign exchange or forex?",
        answer: "Forex simply means exchanging one country’s currency for another, such as converting INR to USD for travel."
      },
      {
        question: "Where can I currency exchange in Hyderabad?",
        answer: "Zenith Forex has a branch in Hyderabad. You can exchange currency at the branch or request home service by contacting our agent."
      },
      {
        question: "Do exchange rates change every day?",
        answer: "Yes, exchange rates change daily based on market trends, demand, and global financial factors."
      },
      {
        question: "What documents are needed for currency exchange in Hyderabad?",
        answer: "You need a valid passport, PAN card, and travel proof such as a visa or flight ticket."
      },
      {
        question: "How much foreign currency can I carry while travelling abroad?",
        answer: "As per RBI norms, you can carry up to USD 3,000 in cash and the remaining in a forex card or traveller’s cheque."
      },
      {
        question: "Can I exchange leftover foreign currency after returning to Hyderabad?",
        answer: "Yes, you can sell leftover foreign currency to Zenith Forex and get Indian Rupees back."
      },
      {
        question: "Why should I choose Zenith Forex for money exchange in Hyderabad?",
        answer: "Zenith Forex offers great rates, transparency, fast service, and provides forex cards and remittances in one place."
      },
      {
        question: "Can I convert leftover foreign currency back to Indian Rupees?",
        answer: "Yes, unused foreign currency can be converted back after return subject to applicable exchange rates."
      },
      {
        question: "What regulatory rules apply for forex transactions in India?",
        answer: "Forex transactions must comply with RBI/FEMA rules, be done at authorised dealers, and follow LRS limits and permitted purposes."
      }
    ],

    NOIDA: [{
      question: "Where can I exchange foreign currency in Noida?",
      answer: "You can exchange foreign currency at authorized money changers, banks, and trusted forex companies in Noida. Always choose a licensed provider for safe and transparent transactions."
    },
    {
      question: "What documents do I need for currency exchange in Noida?",
      answer: "You’ll need a valid ID proof like your passport, Aadhaar card, or PAN card. For foreign exchange while travelling abroad, a valid visa and air ticket are also required."
    },
    {
      question: "Can I get home delivery for currency exchange in Noida?",
      answer: "Yes! Many forex providers in Noida, like Zenith Forex, offer doorstep delivery and pickup of foreign currency for your convenience."
    },
    {
      question: "How can I find the best exchange rates in Noida?",
      answer: "Compare live rates online before visiting a branch. Rates change daily, so booking your rate in advance can help you save money."
    },
    {
      question: "Is it better to exchange money at the airport or in Noida city?",
      answer: "It’s always better to exchange in Noida city — airport counters usually charge higher margins and fees compared to local forex providers."
    },
    {
      question: "Can I exchange leftover foreign currency after my trip?",
      answer: "Yes, you can easily sell your unused foreign cash or traveller’s cheques back to an authorized money exchanger in Noida at the prevailing buy-back rate."
    },
    {
      question: "How much foreign currency can I buy for my international trip?",
      answer: "As per RBI guidelines, an Indian resident can purchase up to USD 2,50,000 per financial year for travel and related purposes."
    },
    {
      question: "Can I exchange foreign coins in Noida?",
      answer: "Most money changers in Noida don’t accept coins — only currency notes are exchanged. You can use coins during travel or keep them as souvenirs."
    },
    {
      question: "Is online forex booking safe in Noida?",
      answer: "Yes, if you’re booking through an RBI-authorized and reputed forex company. Always check for company credentials and use secure payment options."
    },
    {
      question: "Does Zenith Forex offer currency exchange in Noida?",
      answer: "Absolutely! Zenith Forex provides fast, transparent, and competitive money exchange services in Noida — including home delivery, forex cards, and international remittance."
    }
    ],

    BENGALURU: [{
      question: "Where is the best place to currency exchange in Bangalore?",
      answer:
        "Go to RBI-authorized money changers, reputable banks, or trusted forex providers (for example, in MG Road, Koramangala, Indiranagar) to ensure safety, fair rates, and genuine notes."
    },
    {
      question: "What documents do I need for currency exchange in Bangalore?",
      answer:
        "You usually need a valid passport, visa (if applicable), PAN card, and proof of travel (ticket) for larger transactions."
    },
    {
      question: "Can I exchange money in Bangalore airport?",
      answer:
        "Yes, you can exchange money at Kempegowda International Airport, but the rates there tend to be less favorable compared to city outlets."
    },
    {
      question: "Is there a limit on how much foreign currency I can buy?",
      answer:
        "Yes — as per RBI / forex rules, an individual can buy foreign exchange up to USD 2,50,000 (or equivalent) per financial year for permitted purposes."
    },
    {
      question: "Can I get back Indian Rupees by selling leftover foreign currency?",
      answer:
        "Yes — you can surrender or sell unspent foreign currency at authorized exchangers in Bangalore, given proper documentation."
    },
    {
      question: "How far in advance can I order foreign currency?",
      answer:
        "You can place a currency exchange order up to 60 days in advance of your travel."
    },
    {
      question: "Can minors / children also exchange currency?",
      answer:
        "Yes — even a child or newborn can get foreign currency, as long as valid travel documents and PAN (or required ID) are provided."
    },
    {
      question: "Are there any hidden costs or fees I should watch out for during currency exchange in Bangalore?",
      answer:
        "Yes — some providers may offer “zero commission” but with poor exchange rates. Always check the net rate, any service charge, or margin added."
    },
    {
      question: "What if my trip is cancelled — can I keep or return the currency?",
      answer:
        "If the trip is cancelled, forex provided for that trip must be surrendered within 90 days. If postponed, you can retain it if your journey begins within 60 days."
    },
    {
      question: "How can I avoid fraud while doing currency exchange in Bangalore?",
      answer:
        "Always use licensed providers, verify notes carefully, avoid deals via unknown people, and keep receipts. Also be cautious of unsolicited offers on the street. (There have been fraud cases in Bangalore involving fake notes.)"
    }
    ],

    DELHI: [
      {
        question: "What is currency exchange?",
        answer: "Currency exchange means converting one country’s money into another. For example, changing Indian Rupees (INR) into US Dollars (USD) for travel."
      },
      {
        question: "Where can I currency exchange in Delhi?",
        answer: "You can exchange money at authorized Forex dealers, banks, and trusted companies like Zenith Forex located in Delhi."
      },
      {
        question: "Do I need any documents for currency exchange in Delhi?",
        answer: "Yes — you usually need a valid passport, PAN card, and travel documents like flight tickets or visa."
      },
      {
        question: "How much currency can I exchange at a time?",
        answer: "Under the Liberalised Remittance Scheme, you can exchange up to USD 250,000 per year for permitted purposes."
      },
      {
        question: "Are the exchange rates same everywhere in Delhi?",
        answer: "No — exchange rates may differ between banks and forex dealers. It’s best to compare rates before exchanging money."
      },
      {
        question: "Can I exchange leftover foreign currency back to INR in Delhi?",
        answer: "Yes — leftover foreign currency can be converted back to Indian Rupees at authorized dealers or banks."
      },
      {
        question: "Is it safe to exchange currency at local markets or unlicensed dealers?",
        answer: "No — always use RBI-authorized dealers like Zenith Forex to avoid fake notes or unfair rates."
      },
      {
        question: "Can I get different currencies at one place in Delhi?",
        answer: "Yes — most authorized forex providers offer major currencies like USD, EUR, GBP, AED, and some Asian currencies like IDR or VND."
      },
      {
        question: "Do currency exchange centers charge extra fees?",
        answer: "Some may charge a service fee, but many provide transparent pricing without hidden charges. Always confirm beforehand."
      },
      {
        question: "Can I plan online currency exchange in Delhi?",
        answer: "Yes — many companies including Zenith Forex allow online booking, home delivery, and branch pickup options in Delhi."
      }
    ],

    KOLKATA: [
      {
        question: "Where can I do currency exchange in Kolkata?",
        answer: "You can exchange currency at authorized forex providers like Zenith Forex, banks, or RBI-approved money changers located across Kolkata."
      },
      {
        question: "What documents do I need for currency exchange in Kolkata?",
        answer: "You usually need a valid photo ID (like Aadhaar, PAN, or Passport). For higher amounts or foreign currency purchase, your passport and travel details may also be required."
      },
      {
        question: "How can I get the best exchange rates in Kolkata?",
        answer: "Compare rates online before visiting a branch. Zenith Forex, for instance, offers live market rates and transparent pricing with no hidden charges."
      },
      {
        question: "Can I exchange Indian Rupees for multiple foreign currencies at once?",
        answer: "Yes, you can buy multiple foreign currencies depending on your travel destination and requirements, either in cash or on a forex card."
      },
      {
        question: "Is online currency exchange available in Kolkata?",
        answer: "Yes, with Zenith Forex, you can order your foreign currency online and choose home delivery or branch pickup."
      },
      {
        question: "How much foreign currency can I carry while travelling abroad?",
        answer: "As per RBI guidelines, you can carry up to USD 3,000 (or equivalent) in cash and the rest through a forex card or traveller’s cheque for personal travel."
      },
      {
        question: "Can I sell my leftover foreign currency after returning to India?",
        answer: "Yes, you can easily sell unused foreign currency at authorised exchange counters or through online platforms like Zenith Forex."
      },
      {
        question: "Are the exchange rates the same across all money changers in Kolkata?",
        answer: "No, rates may vary slightly. It’s best to check real-time rates online and choose a licensed provider for fair and transparent pricing."
      },
      {
        question: "Can I get foreign currency delivered to my home in Kolkata?",
        answer: "Yes, many providers including Zenith Forex offer doorstep delivery for your convenience after completing KYC verification."
      },
      {
        question: "Is it better to use a Forex Card or cash for international travel?",
        answer: "A Forex Card is safer, easier to carry, and offers better exchange rates compared to carrying large amounts of cash. It’s also widely accepted at international ATMs and stores."
      }
    ],
  };

  // ------------ SELECT FAQ BASED ON CITY OR DEFAULT -------------
  const faqItems = faqData[branchName] && faqData[branchName].length > 0 ? faqData[branchName] : defaultFAQItems;

  return (
    <div className="ctp-faq-area pb-100">
      <div className="shadow-inner">
        <div className="container">
          <div className="section-title ctp-title">
            <h2 style={{ color: '#0080ff' }}>
              {faqData[branchName] ? `FAQ: Currency Exchange in ${branchName}` : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="accordion" id="FaqAccordion">
            {faqItems.map((item, index) => (
              <div className="accordion-item" key={index}>
                <button
                  className={`accordion-button ${activeAccordion === index ? "active" : ""}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {item.question}
                  {/* <i
                    className={`fa fa-arrow-circle-o-${activeAccordion === index ? "up" : "down"}`}
                    style={{ marginLeft: "auto" }}
                  ></i> */}
                </button>

                <div className={`accordion-collapse collapse ${activeAccordion === index ? "show" : ""}`}>
                  <div className="accordion-body">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default FAQAccordion;
