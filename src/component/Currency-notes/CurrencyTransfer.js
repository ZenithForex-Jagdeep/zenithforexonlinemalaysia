
import React, { useState } from 'react'

const CurrencyTransfer = () => {

  const [currentTab, setCurrentTab] = useState('1');

  const tabs = [
    {
      id: 1,
      tabTitle: 'Speed',
      title: 'Title 1',
      src: '/img/speed.png',
      alt: 'Speed',
      para1: `  Speed is an important consideration for those who need
      to exchange money quickly, whether for personal or
      business reasons, allowing customers to exchange
      quickly & efficiently and offering fast & reliable
      service. `,
      para2: ` By prioritizing speed, we provide exchange service to
      customers that is fast, reliable, and efficient,
      meeting their urgent transfer or exchange needs.`,
      list1: `We offer different
      service speeds with options for both same-day and
      next-day services.`,
      list2: ` We have a wide
      network partner to facilitate quick and efficient
      services.`,
      list3: `We provide real-time
      tracking of services, to monitor the progress of
      their transactions.`,
      list4: ` We offer 24/7
      availability, allowing us to initiate services at
      any time of the day or night.`
    },
    {
      id: 2,
      tabTitle: 'Security',
      title: 'Title 2',
      src: '/img/Sequrity.png',
      alt: 'Speed',
      para1: ` Security is most important when it comes to
      transferring money, as customers need to feel
      confident that their personal and financial
      information is protected, and that their funds will
      arrive at their intended destination.`,
      para2: ` By prioritizing the Security measures, we provide
      money transfer service to customers with a safe and
      secure platform that protects their funds and personal
      information.`,
      list1: `We use Encryption
      Technology to protect customers' personal and
      financial information.`,
      list2: `We use Two-Factor
      Authentication to prevent unauthorized access to
      customers' accounts.`,
      list3: `We always comply
      with Regulations and Industry Standards, including
      anti-money laundering laws.`,
      list4: ` We use Fraud
      Detection tools and techniques to identify and
      prevent suspicious or fraudulent transactions.`
    },
    {
      id: 3,
      tabTitle: 'Cost',
      title: 'Title 3',
      src: '/img/saving.png',
      alt: 'Cost',
      para1: `The Cost of a money transfer is an important
      consideration for customers, as they want to ensure
      they are getting a fair deal and not paying excessive
      fees and have competitive rates and transparent
      pricing, with no hidden fees or costs.`,
      para2: `By prioritizing cost-effectiveness, we provide money
      transfer service to customers that is affordable and
      fair, with no surprises or hidden costs.`,
      list1: `We offer rates that
      are in line with market rates, ensuring a fair
      exchange rate for the money.`,
      list2: ` We are transparent
      about the fees, a clear breakdown of any transaction
      fees or other costs.`,
      list3: ` We offer fee-free
      options, for larger transfers or for customers who
      use the service regularly.`,
      list4: `We also offer
      flexible transfer options to cater different needs
      and budgets of the customers.`
    },
    {
      id: 4,
      tabTitle: 'Accessibility',
      title: 'Title 4',
      src: '/img/Assebility.png',
      alt: 'Accessibility',
      para1: ` Accessibility refers to the ease with which customers
      can access and use a range of options for initiating
      money transfers, as well as multiple channels for
      accessing customer support and assistance at ease.`,
      para2: ` By prioritizing Accessibility, we provide money
      transfer service to customers that is easy to use,
      reliable, and convenient, meeting their needs.`,
      list1: `We offer different
      ways to initiate transfers, such as online, by
      phone, or through a mobile app.`,
      list2: `We have multiple
      destinations across all major cities to facilitate
      exchange services.`,
      list3: `We offer multiple
      channels to access support & assistance, such as
      phone, email, chat, or in-person.`,
      list4: `We offer a wide range
      of currencies and destinations for its customers to
      send money.`
    }
  ];

  const handleTabClick = (e) => {
    setCurrentTab(e.target.id);
  }

  const objectStyle = {
    border: '8px solid #F94C10',
    borderRadius: '10px',
    //transition: '.6s ease'

  }

  return (
    <div>
      <div className='shadow-inner'>

        <div className='ctp-key-features-area ptb-100'>

          <div className='container'>

            <div className='section-title ctp-title text-center'>
              <h2>Currency Exchange Key Features</h2>
            </div>


            <div className='ctp-key-features-tabs '>

              <ul className='nav nav-tabs' id="myTab " role="tablist">
                <li className='nav-item'>
                  <div className='my-row my-row2'>
                    {tabs.map((tab, i) =>
                      <button
                        className="nav-link active tab-btn "
                        style={currentTab === `${tab.id}` ? objectStyle : null}
                        data-bs-toggle="tab"
                        role="tab"
                        aria-controls="security" key={i} id={tab.id} disabled={currentTab === `${tab.id}`} onClick={(handleTabClick)}>{tab.tabTitle}</button>

                    )}
                  </div>
                </li>
              </ul>


              <div className="tab-content" id="myTabContent" >

                <div
                  className="tab-pane fade show active"
                  id="security"
                  role="tabpanel"
                >

                  <div className="row justify-content-center">

                    <div className="col-lg-5 col-md-12">

                      <div className="ctp-key-features-image">

                        <div>
                          {tabs.map((tab, i) =>
                            <>

                              <div key={i}>
                                {currentTab === `${tab.id}` && <img
                                  src={tab.src}
                                  alt={tab.alt}
                                  className="key-img"
                                />}
                              </div>
                            </>
                          )}
                        </div>

                      </div>

                    </div>

                    <div className="col-lg-7 col-md-12">
                      <div className="ctp-key-features-content">
                        {/* <div> */}
                        {tabs.map((tab, i) =>
                          <div key={i}>
                            {currentTab === `${tab.id}` && <div><p className='title'>{tab.para1}</p><p>{tab.para2}</p>
                              <ul className="list">
                                <li>
                                  <i className="fa fa-check"></i>{tab.list1}
                                </li>
                                <li>
                                  <i className="fa fa-check"></i>{tab.list2}
                                </li>
                                <li>
                                  <i className="fa fa-check"></i>{tab.list3}
                                </li>
                                <li>
                                  <i className="fa fa-check"></i>{tab.list4}
                                </li>
                              </ul>
                            </div>}
                          </div>
                        )}
                        {/* </div> */}
                      </div>
                    </div>


                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrencyTransfer

