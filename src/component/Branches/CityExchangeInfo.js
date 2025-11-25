import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Data Layer (Moved outside component for clarity) ---
const cityInfo = {
    BENGALURU: {
        heading: "Your Trusted Partner for Money Exchange in Bangalore",
        description:
            "When it comes to money exchange in Bangalore, Zenith Global  stands out for its reliability, speed, and simplicity. We don’t just exchange currency — we build trust, one transaction at a time. So, skip the airport counters and confusing rate boards. Get the best rates, fast service, and complete peace of mind with Zenith Global  — Bangalore’s most dependable name in foreign exchange.",
        subHeading: "Ready to Get Started",
        points: [
            "Best Live Rates",
            "Doorstep Delivery",
            "RBI-Authorized",
            "Secure Online Process",
            "No Hidden Charges",
        ],
        footer: "Exchange Smart. Exchange Safe. Exchange with Zenith Global .",
    },

    HYDERABAD: {
        heading: "Start Your Currency Exchange in Hyderabad Today",
        description:
            "Choose Zenith Global  for hassle-free, transparent, and secure currency exchange in Hyderabad.",
        points: [
            "Best Live Rates",
            "RBI-Compliant & Safe",
            "Home Delivery Available",
            "Wide Range of Currencies",
            "Transparent & Reliable",
        ],
        footer: "Exchange Smart. Exchange Safe. Exchange with Zenith Global .",
    },

    NOIDA: {
        heading: "Book Your Currency Exchange in Noida Now",
        description:
            "Stop overpaying and start saving with Zenith Global  — your most reliable choice for money exchange in Noida.",
        points: [
            "Real-Time Exchange Rates",
            "RBI-Authorized Transactions",
            "Home Delivery Across Noida",
            "Safe, Transparent, and Fast",
        ],
        footer: "Zenith Global  — Smart, Simple & Secure Money Exchange in Noida.", // Added footer for consistency
    },

    DELHI: {
        heading: "Ready to Currency Exchange in Delhi?",
        description:
            "Start your currency exchange in Delhi journey with Zenith Global  today — where every transaction is transparent, every rate is fair, and every delivery is on time.",
        points: [
            "Best Live Forex Rates",
            "Doorstep Delivery",
            "RBI-Authorized",
            "Secure Online Process",
            "No Hidden Charges",
        ],
        footer:
            "Zenith Global  — Smart, Simple & Secure Money Exchange in Delhi.",
    },
};

// Add a robust default for unknown branchNames
cityInfo.DEFAULT = cityInfo.DELHI;


// --- Style Object (CSS-in-JS) ---
const styles = {
    merriweather: {
        fontFamily: "'Merriweather', serif"
    },
    // The main container style, using a card approach
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        borderLeft: '5px solid #0056b3', // Strong brand line
    },
    mainHeading: {
        color: "#002349",
        fontWeight: 800,
        marginBottom: '20px',
        fontSize: '2rem',
    },
    // Style for the feature point icons
    pointIcon: {
        color: "#198754", // Green checkmark for trust
        fontSize: '1.5rem',
    },
    // Style for the point text
    pointText: {
        fontSize: '0.95rem',
        fontWeight: 500,
        color: '#343a40'
    },
    // Strong footer CTA style
    footerCta: {
        // backgroundColor: '#0056b3',
        // color: '#fff',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: '30px',
    }
};


// --- Icon Map for Feature Points ---
// Assign specific icons to generic features for visual interest
const getIcon = (point) => {
    if (point.toLowerCase().includes("rate")) return "📈"; // Rates
    if (point.toLowerCase().includes("delivery") || point.toLowerCase().includes("home")) return "🚚"; // Delivery
    if (point.toLowerCase().includes("rbi") || point.toLowerCase().includes("authorized") || point.toLowerCase().includes("compliant")) return "🛡️"; // RBI/Secure
    if (point.toLowerCase().includes("process") || point.toLowerCase().includes("secure") || point.toLowerCase().includes("online")) return "🌐"; // Online/Secure
    if (point.toLowerCase().includes("charges") || point.toLowerCase().includes("transparent")) return "✅"; // Transparency/No Charges
    if (point.toLowerCase().includes("wide range") || point.toLowerCase().includes("range")) return "🌍"; // Wide range
    return "💡"; // Default icon
};


function CityExchangeInfo({ branchName }) {
    const cityKey = branchName?.toUpperCase() || "DEFAULT";
    const info = cityInfo[cityKey];

    return (
        // Set the section on a light, contrasting background
        <>
            {info && (
                <section className="container-fluid bg-light py-2">
                    <div className="container">
                        {info ? (
                            <div className="mx-auto" style={styles.cardContainer}>

                                {/* Main Heading and Description */}
                                <h2 className="text-center" style={{ ...styles.merriweather, ...styles.mainHeading }}>
                                    {info.heading}
                                </h2>

                                <p className="text-center text-secondary mb-5 lead">
                                    {info.description}
                                </p>

                                {/* Sub Heading (if available) */}
                                {info.subHeading && (
                                    <h4 className="fw-bold mb-4 text-center text-primary" style={styles.merriweather}>
                                        {info.subHeading}
                                    </h4>
                                )}

                                {/* Responsive Feature Grid */}
                                <div className="row justify-content-center">
                                    {info.points.map((p, i) => (
                                        <div key={i} className="col-6 col-md-4 mb-4">
                                            <div className="d-flex flex-column align-items-center text-center">
                                                <div className="mb-2" style={styles.pointIcon}>
                                                    {getIcon(p)}
                                                </div>
                                                <span style={styles.pointText}>{p}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer / Strong Call-to-Action */}
                                {info.footer && (
                                    <div className="mt-4">
                                        <p className="mb-0" style={{ ...styles.merriweather, ...styles.footerCta }}>
                                            {info.footer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-danger fw-semibold mt-4">
                                    No information available for this branchName.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}

export default CityExchangeInfo;