import React, { useEffect, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import FAQ_accordion from "./FAQ_accordion";
import Footer from "./Footer";
import Header from "./Header";
import { MetaTags } from "react-meta-tags";
import * as Common from './Common'


function FAQ() {
  const [metaTag, setMetaTag] = useState({
    "id": 0,
    "page": "",
    "title": "",
    "description": "",
    "url": "",
    "keywords": ""
  })
  useEffect(() => {
    Common.getMetaTagsById('FAQ Page', setMetaTag);
  })
  return (
    <>
      <MetaTags>
        <title>{metaTag?.title}</title>
        <meta name="description" content={metaTag?.description} />
        <meta name="Keywords" content={metaTag?.keywords} />
        <link rel="canonical" href="https://www.zenithglobal.com.my/faq" />
      </MetaTags>
      <Header />
      <div className="footer_header p-2 mb-5">
        <div className="container">
          <h3>FAQ</h3>
        </div>
      </div>
      <Container className="py-5">
        <Accordion defaultActiveKey="0">
          <FAQ_accordion
            eventkey="0"
            header="Q 1. Who is an Authorized Dealer (AD)?"
            bodytext="Ans. An Authorised Dealer (AD) is any person specifically authorized by the Reserve Bank under Section 10(1) of FEMA, 1999, to deal in foreign exchange or foreign securities (the list of ADs is available on www.rbi.org.in) and normally includes banks."
          />
          <FAQ_accordion
            eventkey="1"
            header="Q 2. Who are authorized by the Reserve Bank to sell foreign exchange for travel purposes?"
            bodytext="Ans. Foreign exchange can be purchased from any authorised person, such as an AD Category-I bank and AD Category II. Full-Fledged Money Changers (FFMCs) are also permitted to release exchange for business and private visits."
          />
          <FAQ_accordion
            eventkey="2"
            header="Q 3. How much foreign currency can be carried in cash for travel abroad?"
            bodytext="Ans. Travellers going to all countries other than (a) and (b) below are allowed to purchase foreign currency notes / coins only up to USD 3000 per visit. Balance amount can be carried in the form of store value cards, travellers cheque or banker’s draft. Exceptions to this are (a) travellers proceeding to Iraq and Libya who can draw foreign exchange in the form of foreign currency notes and coins not exceeding USD 5000 or its equivalent per visit; (b) travellers proceeding to the Islamic Republic of Iran, Russian Federation and other Republics of Commonwealth of Independent States who can draw entire foreign exchange (up-to USD 250,000) in the form of foreign currency notes or coins.

            For travellers proceeding for Haj/ Umrah pilgrimage, full amount of entitlement (USD 250,000) in cash or up to the cash limit as specified by the Haj Committee of India, may be released by the ADs and FFMCs."
          />
          <FAQ_accordion
            eventkey="3"
            header="Q 4. How much Indian currency can be brought in while coming into India?"
            bodytext="Ans. A resident of India, who has gone out of India on a temporary visit may bring into India at the time of his return from any place outside India (other than Nepal and Bhutan), currency notes of Government of India and Reserve Bank of India notes up to an amount not exceeding Rs.25,000. A person may bring into India from Nepal or Bhutan, currency notes of Government of India and Reserve Bank of India notes, in denomination not exceeding Rs.100. Any person resident outside India, not being a citizen of Pakistan and Bangladesh and also not a traveller coming from and going to Pakistan and Bangladesh, and visiting India may bring into India currency notes of Government of India and Reserve Bank of India notes up to an amount not exceeding Rs. 25,000 while entering only through an airport.

            Any person resident in India who had gone to Pakistan and/or Bangladesh on a temporary visit, may bring into India at the time of his return, currency notes of Government of India and Reserve Bank of India notes up to an amount not exceeding Rs. 10,000 per person."
          />
          <FAQ_accordion
            eventkey="4"
            header="Q 5. How much foreign exchange can be brought in while visiting India?"
            bodytext="Ans. A person coming into India from abroad can bring with him foreign exchange without any limit. However, if the aggregate value of the foreign exchange in the form of currency notes, bank notes or travellers cheques brought in exceeds USD 10,000 or its equivalent and/or the value of foreign currency alone exceeds USD 5,000 or its equivalent, it should be declared to the Customs Authorities at the Airport in the Currency Declaration Form (CDF), on arrival in India."
          />
          <FAQ_accordion
            eventkey="5"
            header="Q 6. How many days in advance one can buy foreign exchange for travel abroad?"
            bodytext="Ans. Permissible foreign exchange can be drawn 180 days in advance by an individual, resident in India."
          />
          <FAQ_accordion
            eventkey="6"
            header="Q 7. Can one pay by cash full rupee equivalent of foreign exchange being purchased for travel abroad?            "
            bodytext="Ans. Foreign exchange for travel abroad can be purchased from an authorized person against rupee payment in cash below Rs.50,000/-. However, if the sale of foreign exchange is for the amount equivalent to Rs 50,000/- and above, the entire payment should be made by way of a crossed cheque/ banker’s cheque/ pay order/ demand draft/ debit card / credit card / prepaid card only."
          />
          <FAQ_accordion
            eventkey="7"
            header="Q 8. Is there any time-frame for a traveller who has returned to India to surrender foreign exchange?"
            bodytext="Ans. On return from a foreign trip, travellers are required to surrender unspent foreign exchange held in the form of currency notes and travellers cheques within 180 days of return. However, they are free to retain foreign exchange up to USD 2,000, in the form of foreign currency notes or TCs for future use or credit to their Resident Foreign Currency (Domestic) [RFC (Domestic)] Accounts."
          />
          <FAQ_accordion
            eventkey="8"
            header="Q 9. Should foreign coins be surrendered to an Authorised Dealer on return from abroad?"
            bodytext="Ans. The residents can hold foreign coins without any limit."
          />
          <FAQ_accordion
            eventkey="9"
            header="Q 10. Is there any category of visit which requires prior approval from the Reserve Bank or the Government of India?"
            bodytext="Ans. Dance troupes, artistes, etc., who wish to undertake cultural tours abroad, should obtain prior approval from the Ministry of Human Resources Development (Department of Education and Culture), Government of India, New Delhi."
          />
          <FAQ_accordion
            eventkey="10"
            header="Q 11. Whether permission is required for receiving grant/donation from abroad under the Foreign Contribution Regulation Act, 1976?"
            bodytext="Ans. The Foreign Contribution Regulation Act, 1976 is administered and monitored by the Ministry of Home Affairs whose address is given below:

            Foreigners Division, Jaisalmer House, 26, Mansingh Road, New Delhi-110011
            No specific approval from the Reserve Bank is required in this regard"
          />
          <FAQ_accordion
            eventkey="11"
            header="Q 12. Who is permitted to hold International Credit Card (ICC) and International Debit Card (IDC) for undertaking foreign exchange transactions?"
            bodytext="Ans. Banks authorised to deal in foreign exchange are permitted to issue International Debit Cards (IDCs) which can be used by a resident individual for drawing cash or making payment to a merchant establishment overseas during his visit abroad. IDCs can be used only for permissible current account transactions and the usage of IDCs shall be within the LRS limit.

            AD banks can also issue Store Value Card/Charge Card/Smart Card to residents traveling on private/business visit abroad which can be used for making payments at overseas merchant establishments and also for drawing cash from ATM terminals. No prior permission from Reserve Bank is required for issue of such cards. However, the use of such cards is limited to permissible current account transactions and subject to the LRS limit.
            
            Resident individuals maintaining a foreign currency account with an Authorised Dealer in India or a bank abroad, as permissible under extant Foreign Exchange Regulations, are free to obtain International Credit Cards (ICCs) issued by overseas banks and other reputed agencies. The charges incurred against the card either in India or abroad, can be met out of funds held in such foreign currency account/s of the card holder or through remittances, if any, from India only through a bank where the card-holder has a current or savings account. The remittance for this purpose, should also be made directly to the card-issuing agency abroad, and not to a third party. It is also clarified that the applicable credit limit will be the limit fixed by the card issuing banks. There is no monetary ceiling fixed by the RBI for remittances, if any, under this facility. The LRS limit shall not apply to the use of ICC for making payment by a person towards meeting expenses while such person is on a visit outside India.
            
            Use of ICCs/ IDCs can be made for travel abroad in connection with various purposes and for making personal payments like subscription to foreign journals, internet subscription, etc. However, use of ICCs/IDCs is NOT permitted for prohibited transactions indicated in Schedule 1 of FEM (CAT) Amendment Rules 2015 such as purchase of lottery tickets, banned magazines etc.
            
            Use of these instruments for payment in foreign exchange in Nepal and Bhutan is not permitted."
          />
          <FAQ_accordion
            eventkey="12"
            header="Q 13. How much jewellery can be carried while going abroad?"
            bodytext="Ans. Taking personal jewellery out of India is as per the Baggage Rules, governed and administered by Customs Department, Government of India. While no approval of the Reserve Bank is required in this case, approvals, if any, required from Customs Authorities may be obtained."
          />
          <FAQ_accordion
            eventkey="13"
            header="Q 14. Can a resident extend local hospitality to a non-resident?"
            bodytext="Ans. A person resident in India is free to make any payment in Indian Rupees towards meeting expenses, on account of boarding, lodging and services related thereto or travel to and from and within India, of a person resident outside India, who is on a visit to India."
          />
          <FAQ_accordion
            eventkey="14"
            header="Q 15. Can residents purchase air tickets in India for their travel not touching India?"
            bodytext="Ans. Residents may book their tickets in India for their visit to any third country. For instance, residents can book their tickets for travel from London to New York, through domestic/foreign airlines in India. However, the same (air tickets) would be a part of the traveller’s overall LRS entitlement of USD 250,000."
          />
          <FAQ_accordion
            eventkey="15"
            header="Q 16. Is meeting of medical expenses of a NRI close relative, in India, by Resident Individuals permitted?"
            bodytext="Ans. Where the medical expenses in respect of NRI close relative [‘relative’ as defined in Section 2(77) of the Companies Act, 2013) are paid by a resident individual, such a payment being in the nature of a resident to resident transaction may be covered under the term “services related thereto” under Regulation 6(2) of Notification No. FEMA 14(R)/2016-RB dated May 2, 2016."
          />
          <FAQ_accordion
            eventkey="16"
            header="Q 17. Can a person resident in India hold assets outside India?"
            bodytext={
              <>
                <p>
                  Ans. In terms of sub-section 4, of Section (6) of the Foreign
                  Exchange Management Act, 1999, a person resident in India is
                  free to hold, own, transfer or invest in foreign currency,
                  foreign security or any immovable property situated outside
                  India if such currency, security or property was acquired,
                  held or owned by such person when he was resident outside
                  India or inherited from a person who was resident outside
                  India.
                </p>
                <br />Further, a resident individual can also acquire property and other assets overseas under LRS.

                <br />
                1 A "person resident in India" is defined in Section 2(v) of FEMA, 1999 as :
                <ul>
                  <li>(i) a person residing in India for more than one hundred and eighty-two days during the course of the preceding financial year but does not include-
                    <ul>
                      <li>(A) a person who has gone out of India or who stays outside India, in either case
                        <ul>
                          <li>(a) for or on taking up employment outside India, or</li>
                          <li>(b) for carrying on outside India a business or vocation outside India, or</li>
                          <li>(c) for any other purpose, in such circumstances as would indicate his intention to stay outside India for an uncertain period</li>
                        </ul>
                      </li>
                      <li>(B) a person who has come to or stays in India, in either case, otherwise than
                        <ul>
                          <li>(a) for or on taking up employment in India, or</li>
                          <li>(b) for carrying on in India a business or vocation in India, or</li>
                          <li>(c) for any other purpose, in such circumstances as would indicate his intention to stay in India for an uncertain period;</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>(ii) any person or body corporate registered or incorporated in India,</li>
                  <li>(iii) an office, branch or agency in India owned or controlled by a person resident outside India,</li>
                  <li>(iv) an office, branch or agency outside India owned or controlled by a person resident in India.</li>
                </ul>

              </>
            }
          />
        </Accordion>
      </Container>
      <Footer />
    </>
  );
}

export default FAQ;
