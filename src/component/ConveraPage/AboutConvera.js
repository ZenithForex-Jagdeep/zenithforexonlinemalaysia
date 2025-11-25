import React from "react";

const AboutConvera = () => {
    return (
        <section>
            <div className="container-fluid" style={styles.sectionStyle}>
                {/* <div style={styles.overlay}></div> Optional dark overlay */}
                <div style={styles.contentStyle}>
                    <img
                        src="../img/logo.png"
                        alt="Zenith Forex Logo"
                    />
                    <h6 style={styles.titleStyle}>Zenith Forex Online – The Best International Money Transfer for Students</h6>
                    <p style={styles.paragraphStyle}>
                        Zenith Forex Online stands out as the top choice for students who need a reliable and efficient solution for international money transfer. Whether you're paying tuition fees, covering living expenses, or managing other overseas costs, Zenith Forex makes it easy to send money abroad with complete peace of mind.
                    </p>
                    <p style={styles.paragraphStyle}>
                        We understand that students and parents want a process that’s simple, transparent, and secure. That’s why Zenith Forex offers competitive exchange rates, low service charges, and quick transaction times. With our streamlined online platform and dedicated support team, students can focus on their studies while we handle the complexities of global payments.
                    </p>
                    <p style={styles.paragraphStyle}>
                        Our strong partnership with trusted providers like Convera ensures that your money reaches its destination safely and on time. Zenith Forex also helps students comply with RBI guidelines, making sure each international money transfer is fully compliant and hassle-free.
                    </p>
                    <p style={styles.paragraphStyle}>
                        Whether you're studying in the US, UK, Canada, Australia, or anywhere around the world, Zenith Forex is here to support your educational journey. Send money abroad with ease and confidence—choose Zenith Forex Online for secure and smart student remittances.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutConvera;

const styles = {
    sectionStyle: {
        backgroundImage: `url("./Assets/images/about-convera.png")`, // Place this image in /public
        // < img style={ styles.image } src='./Assets/images/background.png' alt="abc" />
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "80vh",
        position: "relative",
        color: "white",
        display: "flex",
        alignItems: "center",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: dim background for text readability
        zIndex: 1,
    },
    contentStyle: {
        position: "relative",
        zIndex: 2,
        padding: "40px",
        maxWidth: "60vw",
    },
    headingStyle: {
        letterSpacing: "8px",
        fontWeight: 300,
        marginBottom: "10px",
    },
    titleStyle: {
        fontSize: "40px",
        fontWeight: 300,
        marginBottom: "20px",
    },
    paragraphStyle: {
        // lineHeight: 1.6,
        fontSize: '1.1rem',
        marginBottom: "10px",
        // color: "#f0f0f0",
    },
};
