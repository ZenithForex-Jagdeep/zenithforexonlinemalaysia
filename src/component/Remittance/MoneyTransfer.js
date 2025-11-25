import React, { useState } from 'react'
const MoneyTransfer = () => {

  const [currentTab, setCurrentTab] = useState('1');

  const tabs = [
    {
      id: 1,
      tabTitle: 'Speed',
      title: 'Title 1',
      src: '/img/speed.png',
      alt: 'Speed',
      para1: ` In today's world, people are constantly moving across
      borders for work, education, or other reasons. This
      has increased the need for reliable and efficient
      money transfer services to enable individuals to send
      and receive funds across borders easily.`,
      para2: `Zenith Forex Online offers a range of key features
      that make it easy and convenient to transfer funds
      across borders. From speed and security to
      affordability and ease of use, these services are an
      essential tool for individuals and businesses that
      need to send and receive money globally.`,
      list1: `You can transfer
      funds quickly, often within a matter of minutes or
      hours.`,
      list2: `Transfer Money more
      Securely with advanced encryption and security
      protocols.`,
      list3: `More affordable than
      traditional banking services for international money
      transfers.`,
      list4: ` More accessible than
      traditional banking services, particularly for
      individuals.`
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
      list2: `We have a
      user-friendly and intuitive interface to initiate,
      track and access services.`,
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
    // transition: 'all .5s ease'
    //transition: '.6s ease'

  }

  return (
    <>
      <div className='shadow-inner'>

        <div className='ctp-key-features-area ptb-100'>

          <div className='container'>

            <div className='section-title ctp-title text-center'>
              <h2>Money Transfer Key Features</h2>
            </div>

            <div className='ctp-key-features-tabs text-center m-auto '>
              <ul className='nav nav-tabs' id="myTab " role="tablist">
                <li className='nav-item'>
                  <div className='my-row my-row2'>
                    {tabs.map((tab, i) =>
                      <button
                        style={currentTab === `${tab.id}` ? objectStyle : null}
                        className="nav-link active tab-btn "
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



      {/* <div className='container'>
        <div className='tabs' >
          {tabs.map((tab, i) =>
            <button key={i} id={tab.id} disabled={currentTab === `${tab.id}`} onClick={(handleTabClick)}>{tab.tabTitle}</button>
          )}
        </div>
        <div className='content'>
          {tabs.map((tab, i) =>
            <div key={i}>
              {currentTab === `${tab.id}` && <div><p className='title'>{tab.title}</p><p>{tab.content}</p></div>}
            </div>
          )}
        </div>
      </div> */}
    </>

  )
}


export default MoneyTransfer






