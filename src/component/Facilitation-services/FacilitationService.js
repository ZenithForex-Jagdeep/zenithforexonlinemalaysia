import React from 'react'
import { useState } from 'react';

const FacilitationService = () => {

  const [currentTab, setCurrentTab] = useState('1');

  const tabs = [
    {
      id: 1,
      tabTitle: 'Speed',
      title: 'Title 1',
      src: '/img/speed.png',
      alt: 'Speed',
      para1: ` Visa Facilitation: Streamlines the visa application
      process, providing guidance on required documentation,
      ensuring completeness, and minimizing errors.`,
      para2: `Tours Facilitation: Simplifies travel planning by
      offering end-to-end support, including itinerary
      creation, accommodation, transportation, and activity
      arrangements.`,
      list1: `Ensures a smooth and
      efficient visa process with guidance and assistance.`,
      list2: `Offer expert support
      and help minimize errors that lead to delays or
      rejection of visa applications`,
      list3: `Takes care of all
      aspects of travel planning, from creating
      itineraries to arranging accommodations,
      transportation, and activities.`,
      list4: ` It provides
      comprehensive support throughout the travel journey,
      ensuring a hassle-free experience.`
    },
    {
      id: 2,
      tabTitle: 'Security',
      title: 'Title 2',
      src: '/img/Sequrity.png',
      alt: 'Speed',
      para1: `Visa Facilitation: Experienced professionals provide
      expert advice and guidance, helping applicants
      navigate complex visa requirements and addressing
      their queries.`,
      para2: `Tours Facilitation: Knowledgeable facilitators offer
      destination-specific expertise, suggesting unique
      experiences, and ensuring a well-planned itinerary`,
      list1: `Provide expert
      advice, assisting applicants in understanding and
      navigating complex visa requirements.`,
      list2: `Address applicant
      queries, ensuring clarity and providing necessary
      information.`,
      list3: `Offer expertise on
      various destinations, providing valuable insights
      and recommendations for unique travel experiences.`,
      list4: ` Create
      well-structured itineraries, considering preferences
      and interests, to ensure a seamless and enjoyable
      travel experience.`
    },
    {
      id: 3,
      tabTitle: 'Cost',
      title: 'Title 3',
      src: '/img/saving.png',
      alt: 'Cost',
      para1: `Visa Facilitation: Handles administrative tasks,
      coordination with embassies, and submission of
      documents, saving applicants time and effort.`,
      para2: `Tours Facilitation: Takes care of travel logistics,
      including booking accommodations, arranging
      transportation, and coordinating activities, freeing
      travellers from the hassle of managing these details.`,
      list1: `Manages
      administrative tasks associated with visa
      applications, saving applicants valuable time and
      effort.`,
      list2: `Handles coordination
      , ensuring efficient communication and reducing the
      burden on travellers.`,
      list3: `Takes care of all
      travel logistics, relieving travellers from the
      hassle of managing these details.`,
      list4: `Provides end-to-end
      support, allowing to focus on enjoying their trip
      without the stress of organizing.`
    },
    {
      id: 4,
      tabTitle: 'Accessibility',
      title: 'Title 4',
      src: '/img/Assebility.png',
      alt: 'Accessibility',
      para1: `Visa Facilitation: Smooth visa processing ensures a
      stress-free start to the travel journey, allowing
      travellers to focus on enjoying their trip.`,
      para2: `Tours Facilitation: Offers curated travel experiences,
      insider knowledge, and access to local attractions,
      maximizing the enjoyment and exploration of
      destinations.`,
      list1: `Visa facilitation
      ensures a seamless and efficient visa application
      process, eliminating stress and delays.`,
      list2: `Handling the
      complexities of visa processing, travellers can
      focus on enjoying their trip.`,
      list3: `Provides carefully
      curated travel experiences, offering customized
      itineraries and activities.`,
      list4: `Provide valuable
      insights into local attractions, making the most of
      their awesome.`
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
              <h2>Facilitation service Key Features</h2>
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

export default FacilitationService
