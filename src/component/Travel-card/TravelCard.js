import React from 'react'
import { useState } from 'react';

const TravelCard = () => {

  const [currentTab, setCurrentTab] = useState('1');

  const tabs = [
    {
      id: 1,
      tabTitle: 'Speed',
      title: 'Title 1',
      src: '/img/speed.png',
      alt: 'Speed',
      para1: ` Travel cards provide immediate access to loaded
      funds, allowing quick payments at merchants, cash
      withdrawals from ATMs, and seamless online
      transactions. This speed and convenience ensure
      uninterrupted access to funds while traveling.`,
      para2: ` By prioritizing speed, we provide customers with
      service that is fast, reliable, and efficient,
      meeting their urgent transfer needs.`,
      list1: `Travel cards can
      be used for secure and convenient online
      transactions.`,
      list2: `It also functions
      as debit cards, allowing you to withdraw cash from
      ATMs in the foreign countries.`,
      list3: ` With a travel
      card, you can conveniently make payments at
      various merchant locations.`,
      list4: ` Travel cards offer
      immediate access to funds once they are loaded
      onto the card.`
    },
    {
      id: 2,
      tabTitle: 'Security',
      title: 'Title 2',
      src: '/img/Sequrity.png',
      alt: 'Speed',
      para1: `Travel cards offer enhanced security with chip and
      PIN technology, protecting against loss or theft.
      They can be blocked and replaced, safeguarding
      funds, and provide added security for online
      transactions through a CVV number.`,
      para2: ` By prioritizing the Security measures, we provide
      money transfer service to customers with a safe and
      secure platform that protects their funds and personal
      information.`,
      list1: `Equipped with chip
      and PIN technology, making them more secure than
      carrying cash.`,
      list2: `It can be blocked
      and replaced in case of theft, ensuring that your
      funds are protected.`,
      list3: `Provide an extra
      layer of security with the inclusion of a card
      verification value (CVV) number.`,
      list4: ` Travel cards employ robust security measures to
      protect against fraud.`
    },
    {
      id: 3,
      tabTitle: 'Cost',
      title: 'Title 3',
      src: '/img/saving.png',
      alt: 'Cost',
      para1: ` Travel cards offer cost-effectiveness for
      international travellers, with lower transaction
      fees and competitive exchange rates compared to
      traditional cards. They save on currency conversion
      fees, avoid unfavourable rates, and may provide fee
      waivers or discounts, enhancing their
      cost-effectiveness.`,
      para2: `By prioritizing cost-effectiveness, we provide money
      transfer service to customers that is affordable and
      fair, with no surprises or hidden costs.`,
      list1: `Travel cards have
      lower transaction fees compared to traditional
      credit or debit cards.`,
      list2: `It offers
      competitive exchange rates, which are often more
      favourable compared to others.`,
      list3: `You can load your
      card with the currency of your choice at a
      favourable exchange rate.`,
      list4: `It also offers
      additional cost-saving benefits, such as fee
      waivers or discounts for specific transactions.`
    },
    {
      id: 4,
      tabTitle: 'Accessibility',
      title: 'Title 4',
      src: '/img/Assebility.png',
      alt: 'Accessibility',
      para1: `Travel cards offer global acceptance at millions of
      merchant locations and ATMs, allowing convenient
      payments and cash withdrawals in local currency.
      Accepted at hotels, restaurants, shops, and online
      platforms, they provide versatile usage options
      during travel.`,
      para2: ` By prioritizing Accessibility, we provide money
      transfer service to customers that is easy to use,
      reliable, and convenient, meeting their needs.`,
      list1: `Travel cards are
      widely accepted at millions of merchant locations
      worldwide.`,
      list2: `Travel cards also
      provide access to a vast network of ATMs
      worldwide.`,
      list3: `You can make
      payments and withdraw cash in the local currency
      of the country you are visiting.`,
      list4: `Travel cards are
      accepted at various establishments, including
      hotels, restaurants, shops, and online platforms.`
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
              <h2>Travel Card Key Features</h2>
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

export default TravelCard

