// import React from "react";

// function GicFaQ() {
//   return (
//     <div>
//       <div className="shadow-inner">
//         <div className="container">
//           <div className="section-title ctp-title">
//             <h1>Frequently Asked Questions</h1>
//           </div>
//           <div className="accordion mb-5 mt-5" id="accordionExample">
//             <div className="accordion-item">
//               <h1 className="accordion-header" id="headingOne">
//                 <button
//                   className="accordion-button"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#collapseOne"
//                   aria-expanded="true"
//                   aria-controls="collapseOne"
//                 >
//                   Can I withdraw money from my GIC?
//                 </button>
//               </h1>
//               <div
//                 id="collapseOne"
//                 className="accordion-collapse collapse show"
//                 aria-labelledby="headingOne"
//                 data-bs-parent="#accordionExample"
//               >
//                 <div className="accordion-body h5">
//                   <strong>Depending on the GIC's terms,</strong> you may be able
//                   to withdraw a portion of the assets as well as the earned
//                   interest on a monthly basis. However, some GICs have
//                   withdrawal limits, so read the terms and conditions carefully.
//                 </div>
//               </div>
//             </div>
//             <div className="accordion-item">
//               <h1 className="accordion-header" id="headingTwo">
//                 <button
//                   className="accordion-button collapsed"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#collapseTwo"
//                   aria-expanded="false"
//                   aria-controls="collapseTwo"
//                 >
//                   Which banks offer GICs for international students in Canada?
//                 </button>
//               </h1>
//               <div
//                 id="collapseTwo"
//                 className="accordion-collapse collapse"
//                 aria-labelledby="headingTwo"
//                 data-bs-parent="#accordionExample"
//               >
//                 <div className="accordion-body h5">
//                   <strong>ICICI Bank Canada and Scotiabank</strong> are two
//                   Canadian banks that provide GICs to international students
//                   traveling to Canada. Before making a decision, it is best to
//                   conduct research on several banks and compare their products.
//                 </div>
//               </div>
//             </div>
//             <div className="accordion-item">
//               <h1 className="accordion-header" id="headingThree">
//                 <button
//                   className="accordion-button collapsed"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#collapseThree"
//                   aria-expanded="false"
//                   aria-controls="collapseThree"
//                 >
//                   How long is the term of a GIC?
//                 </button>
//               </h1>
//               <div
//                 id="collapseThree"
//                 className="accordion-collapse collapse"
//                 aria-labelledby="headingThree"
//                 data-bs-parent="#accordionExample"
//               >
//                 <div className="accordion-body h5">
//                   <strong>Depending on the bank and the programme</strong>, the
//                   length of a GIC might range from several months to several
//                   years. Term lengths typically range from six months to ten
//                   years.
//                 </div>
//               </div>
//             </div>
//             <div className="accordion-item">
//               <h1 className="accordion-header" id="headingFour">
//                 <button
//                   className="accordion-button collapsed"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#collapseFour"
//                   aria-expanded="false"
//                   aria-controls="collapseFour"
//                 >
//                   Is the interest rate fixed for the entire GIC term?
//                 </button>
//               </h1>
//               <div
//                 id="collapseFour"
//                 className="accordion-collapse collapse"
//                 aria-labelledby="headingFour"
//                 data-bs-parent="#accordionExample"
//               >
//                 <div className="accordion-body h5">
                  // <strong>Yes, It Yes,</strong> the interest rate on a GIC is
                  // usually fixed for the life of the period. This allows you to
                  // predict your return on investment.
//                 </div>
//               </div>
//             </div>
//             <div className="accordion-item">
//               <h1 className="accordion-header" id="headingFive">
//                 <button
//                   className="accordion-button collapsed"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#collapseFive"
//                   aria-expanded="false"
//                   aria-controls="collapseFive"
//                 >
//                   Are GICs safe investments?
//                 </button>
//               </h1>
//               <div
//                 id="collapseFive"
//                 className="accordion-collapse collapse"
//                 aria-labelledby="headingFive"
//                 data-bs-parent="#accordionExample"
//               >
//                 <div className="accordion-body h5">
                  // <strong>GICs are considered secure investments </strong>
                  // since they guarantee the principal amount as well as the
                  // predetermined interest rate. However, it is critical to select
                  // trustworthy institutions and comprehend the specific GIC
                  // program's terms and conditions.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GicFaQ;

import React, { useState } from 'react'

const GicFaQ = () => {

  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  const faqItems = [
    {
      question: 'Can I withdraw money from my GIC?',
      answer:
        `Depending on the GIC's terms, you may be able
        to withdraw a portion of the assets as well as the earned
        interest on a monthly basis. However, some GICs have
        withdrawal limits, so read the terms and conditions carefully.`,
    },
    {
      question: 'Which banks offer GICs for international students in Canada?',
      answer:
        `ICICI Bank Canada and Scotiabank are two
        Canadian banks that provide GICs to international students
        traveling to Canada. Before making a decision, it is best to
        conduct research on several banks and compare their products.`,
    },
    {
      question: 'How long is the term of a GIC?',
      answer:
        `Depending on the bank and the programme, the
        length of a GIC might range from several months to several
        years. Term lengths typically range from six months to ten`,
    },
    {
      question: 'Is the interest rate fixed for the entire GIC term?',
      answer:
        `Yes, It Yes, the interest rate on a GIC is
        usually fixed for the life of the period. This allows you to
        predict your return on investment.`,
    },
    {
      question: 'Are GICs safe investments?',
      answer:
        `GICs are considered secure investments
        since they guarantee the principal amount as well as the
        predetermined interest rate. However, it is critical to select
        trustworthy institutions and comprehend the specific GIC
        program's terms and conditions.`,
    },
  ];

  return (
    <div>
      <div className="ctp-faq-area pb-100">
        <div className="shadow-inner">
          <div className="container">
            <div className="section-title ctp-title">
              <h2>Frequently Asked Questions</h2>
            </div>
            <div className="ctp-faq-accordion">
              <div className="accordion" id="FaqAccordion">
                {faqItems.map((item, index) => (
                  <div className="accordion-item" key={index}>
                    <button
                      className={`accordion-button ${activeAccordion === index ? 'active' : ''}`}
                      type="button"
                      onClick={() => toggleAccordion(index)}
                    >
                      {item.question}
                      <i className={`fa fa-arrow-circle-o-${activeAccordion === index ? 'up' : 'down'}`} style={{ float: 'right' }}></i>
                    </button>
                    <div
                      className={`accordion-collapse collapse ${activeAccordion === index ? 'show' : ''}`}
                      data-bs-parent="#FaqAccordion"
                    >
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
      </div>
    </div>
  )
}

export default GicFaQ

