import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

const SendMoneySteps = () => {
    const steps = [
        {  title: "Create an Account ", desc: 'Sign up with Convera Payments and complete a quick verification process.', color: "#c63fab" },
        {  title: "Log In to the Platform ", desc: 'Access your dashboard and choose the payment option that suits your needs.', color: "#7b57c1" },
        {  title: "Enter Recipient Details ", desc: 'Add the beneficiary’s information, including banking details and country.', color: "#3ca0dd" },
        {  title: "Choose Amount & Currency ", desc: 'Select how much you want to send and in which currency.', color: "#f2aa2f" },
        {  title: "Review & Confirm ", desc: 'Double-check the details, confirm the transaction, and track your payment in real time.', color: "#5cb85c" },
    ];

    return (
        <div style={styles.container} >
            <h1 className="text-center text-primary fw-bold mb-3">Send Money in Easy Steps with Convera Payments</h1>
            <p className="text-center fx-bold" style={{
                fontSize: '1.15rem', paddingInline: '11rem',
                fontWeight: '400',
            }} >Making international transfers is simple and stress-free with Convera Payments. Just follow these easy steps to send money quickly and securely:</p>
            <div className="row">
                <div className="col-md-6 d-flex align-items-center justify-content-center " style={{ zIndex: 100 }}>
                    <img
                        // src="./Send Money In Easy Steps.png"
                        src="./Assets/images/Send Money In Easy Steps.png"
                        alt="Money Icon"
                        style={{
                            width: '87vw',
                            height: '68vh',
                        }}
                    />
                </div>
                <div className="col-md-6" style={{
                    position: 'absolute', position: 'absolute',
                    left: '40vw'
                }} >
                    <div style={{ position: "relative", paddingTop: '3rem' }}>
                        {/* <div
                            style={{
                                content: '""',
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: "26px",
                                width: "4px",
                                backgroundColor: "#e0e0e0",
                                zIndex: 0,
                            }}
                        ></div> */}

                        {steps.map((step, index) => (
                            <div
                                className="d-flex align-items-start mb-4 position-relative"
                                key={index}
                            >
                                <div
                                    style={{
                                        backgroundColor: "#fff",
                                        padding: "15px 20px",
                                        borderRadius: "10px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                        flexGrow: 1,
                                        paddingLeft: '3rem',
                                    }}
                                >
                                    <h6 className="fw-bold">{step.title}</h6>
                                    <p className="mb-0">
                                        {step.desc}
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

export default SendMoneySteps;


const styles = {
    container: {
        backgroundColor: '#E8E9EA',
        padding: '2rem',
    },
}