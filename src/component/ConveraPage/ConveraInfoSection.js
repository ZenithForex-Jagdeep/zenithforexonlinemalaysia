import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./styles.css";

const cards = [
    {
        heading: 'Pay in INR Globally , Get Full Value ',
        desc: 'Settle your university fees in INR, and your institution receives the exact amount — no hidden charges, no surprises.',
        img: './Assets/images/converainfoi1.png'
    },
    {
        heading: 'Locked-in Rates, Total Transparency',
        desc: 'Enjoy student-friendly exchange rates powered by Convera’s global expertise, giving you clarity and savings every time.',
        img: './Assets/images/converainfoi2.png'
    },
    {
        heading: 'Globally Secure, Locally Reliable',
        desc: 'Your payments are fully compliant and safeguarded by Convera’s worldwide standards, with Zenith Forex ensuring trusted local support in India.',
        img: './Assets/images/converainfoi3.png'
    },
    {
        heading: 'Track with Ease, Support on Demand',
        desc: ' Follow your payment in real time with Convera’s tracking tools, backed by responsive assistance from Zenith Forex whenever you need it.',
        img: './Assets/images/converainfoi4.png'
    }
];

const SendMoneyAbroad = () => {
    const Styles = {
        img: {
            width: 'inherit',
            margin: '0px',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
        }
    }



    return (
        <div className="bg-primary text-white py-5">
            <div className="container text-center">
                <h1 className="fw-bold mb-3">Pay Your International Fees the Smart Way with Convera & Us
                </h1>
                {/* <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                    Fees the Smart Way with Convera & Us
                </p> */}
                <p className="mb-5">
                    Zenith Forex has joined hands with Convera to make cross borders university fee payments faster, more affordable, and highly secure for Indian students and their families. With decades of expertise in global payments and a trusted presence in over 200+ countries and territories, Convera brings unmatched reliability and regulatory strength to Zenith Forex’s platform.
                    Through this powerful integration, students and parents benefit from competitive exchange rates, quicker settlements, and complete transaction visibility—all through a seamless, user-friendly interface. This partnership reflects our commitment to empowering Indian students with a transparent, stress-free, and smarter way of paying international tuition fees.

                </p>
                <h2 className="pb-2">Why Choose Convera Through Zenith Forex?</h2>
                <div className="d-flex justify-content-center align-items-center gap-3">
                    {/* <button className="btn btn-light rounded-circle shadow">
                        &larr;
                    </button> */}
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 flex-nowrap overflow-auto">
                        {cards.map((card, index) => (
                            <div className="col" key={index}>
                                <div className="card  shadow rounded-4" style={{ padding: '0px' }}>
                                    <img
                                        src={card.img}
                                        style={Styles.img}
                                        alt="Student Group"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {/* <span className="badge bg-white text-primary">
                                                {index + 1}
                                            </span> */}
                                            <span className=" text-primary px-2 py-1 rounded">
                                                {card.heading}
                                            </span>
                                        </h5>
                                        <p className="card-text mt-3 text-dark">
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <div className="text-center">
                        <button className="btn btn-light rounded-circle shadow">
                            &rarr;
                        </button>
                        <div className="small text-white mt-2">Slide For More</div>
                    </div> */}
                </div>
            </div>
        </div >
    );
};


export default SendMoneyAbroad;


