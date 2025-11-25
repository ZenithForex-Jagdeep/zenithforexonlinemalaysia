import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Row } from "react-bootstrap";

const WhyChooseUs = () => {
    const points = [
        { heading: 'Powered by Convera Global Pay ', text: 'Leverage a world-class platform for reliable and efficient international payments.' },
        { heading: 'Trusted Service ', text: ' Zenith Global brings years of expertise and personalized support to every transaction.' },
        { heading: 'Fast & Secure Transfers ', text: 'Enjoy peace of mind with encrypted, compliant, and quick money transfers.' },
        { heading: 'Global Coverage ', text: 'Send funds to over 200 countries and territories using multiple currencies with ease.' },
    ];

    return (
        <div style={styles.container}>
            <div className="row align-items-center m-0">
                {/* Left Section with Image and Overlays */}
                <div className="col-md-6 position-relative mb-4 mb-md-0 d-flex justify-content-center">
                    <img
                        src="./Assets/images/convera-why-choose-us-image.png"
                        className="img-fluid rounded p-0"
                        style={styles.img1}
                        alt="Main"
                    />
                </div>

                {/* Right Section with Text and Points */}
                <div className="col-md-6">
                    <h1 className="fw-bold">
                        Why Choose <span className="text-primary">Zenith Global US?</span>
                    </h1>
                    <p className="text">
                        Zenith Global is your trusted partner for seamless international money transfers, offering expert solutions through Convera Global Pay. With a commitment to security, speed, and convenience, Zenith Global ensures that every transaction is handled with professionalism and care. Whether you're managing personal remittances or business payments, our integration with Convera Global Pay allows you to send money worldwide with confidence and ease.
                    </p>

                    <div className="d-flex flex-column gap-3 mt-4">
                        {points.map((bene, index) => (
                            <div className="d-flex align-items-center " key={index}>
                                <div className="circle-number me-3" style={styles.userIcon}><FontAwesomeIcon icon={faUser} style={{ fontSize: '1.5rem' }} /></div>
                                <div>
                                    <h5 className="mb-1 fw-bold">{bene.heading}</h5>
                                    <p className="mb-0  text-muted">
                                        {bene.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;

const styles = {
    container: {
        backgroundColor: '#E6F4FF',
        paddingX: '2rem',
        paddingY: '2rem',
        padding: '2rem',
    },
    img1: {
        height: '30rem',
        width: 'auto',
    },
    userIcon: {
        width: '3.5rem',
        height: '3.5rem',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'white',
    }
    //     hides=ScrollV=Bar: {
    //             scrollbar-width: none; /* Firefox */
    // -ms - overflow - style: none;  /* IE 10+ */
    // overflow: auto;
    // }

    // .your - element:: -webkit - scrollbar {
    //     display: none; /* Chrome, Safari, and Opera */
    // }
}
