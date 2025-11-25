import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Data Layer (EXACTLY AS PROVIDED BY THE USER - Moved outside component) ---
const whyChooseData = {
    BENGALURU: {
        title: "Why Bangalore Prefers Zenith Forex Online",
        paragraphs: [
            "Bangalore, India’s technology and business capital, deserves a currency exchange service that matches its pace and professionalism. Zenith Forex Online was built to simplify forex for every kind of user — tech professionals, corporate travelers, students, families, and entrepreneurs.",
            "Our online-first model, fast service, and transparent rates have made us a trusted choice for currency exchange in Bangalore. Whether you’re traveling to the US for work, studying in Canada, or attending a conference in Europe — we ensure your money is converted quickly and efficiently."
        ],
        // image: "https://via.placeholder.com/500x350/F8F9FA/000000?text=Bangalore+Forex" // Placeholder image
    },

    HYDERABAD: {
        title: "Why Hyderabad Residents Trust Zenith Forex Online",
        paragraphs: [
            "Hyderabad is a city full of globetrotters — from IT professionals flying overseas to students moving abroad for higher studies. With such a dynamic environment, travelers need a forex partner that is reliable, fast, and transparent. Zenith Forex Online fits the bill perfectly, combining live rates, secure processes, and doorstep convenience to meet the needs of everyone in Hyderabad.",
            "Whether it’s cash currency for travel, a forex card, or reconverting leftover foreign currency, Zenith Forex Online ensures your transactions are handled professionally, quickly, and safely."
        ],
        // image: "https://via.placeholder.com/500x350/F8F9FA/000000?text=Hyderabad+Forex" // Placeholder image
    },

    KOLKATA: {
        title: "Why Kolkata Residents Prefer Zenith Forex Online",
        paragraphs: [
            "Kolkata is a city of travelers, students, builders, and dreamers. Whether you're heading abroad for higher studies, work, or leisure, you deserve a <strong>money exchange in Kolkata</strong> partner you can rely on. Zenith Forex Online brings you:",
        ],
        bullets: [
            "Speed and convenience that fits your lifestyle",
            "Clarity and fairness in every transaction",
            "A trustworthy, local presence with global capability"
        ],
        extra:
            "Skip the queues at airport counters or unverified street exchangers. With Zenith Forex Online, your currency needs are handled professionally, securely, and transparently — every time. Start your currency exchange in Kolkata today with Zenith Forex Online. Get real-time rates, complete the process online, and receive your foreign currency without hassle. Exchange smart. Exchange safe. Exchange with Zenith Forex Online.",
        // image: "https://via.placeholder.com/500x350/F8F9FA/000000?text=Kolkata+Forex" // Placeholder image
    },

    DELHI: {
        title: "Why People in Delhi Choose Zenith Forex Online",
        bullets: [
            "Convenience Meets Trust — No standing in lines or searching for local money changers. Just open Zenith Forex Online, get live rates, and complete your order in minutes.",
            "Dedicated Delhi Support Team — Our Delhi-based support team ensures your queries are answered fast — whether it’s documentation, tracking, or rate clarification.",
            "Multiple Forex Services Under One Roof — Beyond just currency exchange in Delhi, we also offer forex cards, outward remittance, and currency buy-back services for returning travelers.",
            "Safe Transactions, Guaranteed — We combine RBI authorization with modern technology to make every transaction fully secure and traceable.",
            "Transparent, Honest & Hassle-Free — With Zenith Forex Online, there are no hidden margins, no inflated prices, and no confusion. We’ve built our reputation on clarity, fairness, and reliability."
        ],
        // image: "https://via.placeholder.com/500x350/F8F9FA/000000?text=Delhi+Forex" // Placeholder image
    },
    NOIDA: {
        title: "When it comes to <strong>currency exchange in Noida</strong, no one understands your needs better than Zenith Forex Online.",
        bullets: [
            "<strong>Thousands of happy customers<strong> across Noida and NCR",
            "<strong>Real-time rates and transparent transactions<strong> every single time.",
            "<strong>Doorstep service<strong> that saves time and effort.",
            "<strong>Multiple currency options<strong> for every traveler or student.",
            "<strong>Trusted brand name<strong> known for honesty and efficiency."
        ],
        // image: "https://via.placeholder.com/500x350/F8F9FA/000000?text=Delhi+Forex" // Placeholder image
    }
};

// Add a robust default for unknown branchNames (using DELHI as it has both bullets and paragraphs for demo)
whyChooseData.DEFAULT = whyChooseData.DELHI;


// --- Style Object (CSS-in-JS) ---
const styles = {
    merriweather: {
        fontFamily: "'Merriweather', serif"
    },
    mainTitle: {
        fontFamily: "'Merriweather', serif",
        color: "#002349", // Deep brand blue
        fontWeight: 700,
        marginBottom: '40px',
    },
    bulletIcon: {
        fontSize: "1.2rem",
        color: "#0056b3", // Primary brand blue
    },
    // Enhanced style for the bullet list container (card-like)
    highlightBox: {
        padding: '30px',
        borderRadius: '10px',
        backgroundColor: '#fff', // White background
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', // Soft shadow for a "lifted" effect
        borderLeft: '5px solid #0056b3', // Strong blue left border
        height: '100%', // Ensure it takes full height of its column
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Vertically center content if box is taller
    },
    extraText: {
        fontSize: '0.95rem',
        marginTop: '25px',
        fontStyle: 'italic',
        color: '#6c757d',
        borderTop: '1px dashed #ced4da', // Subtle dashed border
        paddingTop: '15px',
    },
    imageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        marginBottom: '20px', // Space below image on small screens
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px', // Slightly rounded corners for the image
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Subtle shadow for the image
    }
};


// --- The Component ---
const WhyChooseComponent = ({ branchName }) => {
    const cityKey = branchName?.toUpperCase() || "DEFAULT";
    const data = whyChooseData[cityKey] || whyChooseData.DEFAULT;

    const keyFeatures = data.bullets || [];
    const mainContent = data.paragraphs || [];
    const hasImage = data.image && data.image.length > 0; // Check if an image URL exists

    // Determine if the content is primarily paragraphs (long text) or bullets (short points)
    const isParagraphHeavy = mainContent.length > 0;

    // --- Dynamic Column Distribution Logic ---
    let mainContentColSize = "col-lg-6";
    let keyFeaturesColSize = "col-lg-6";
    let imageColSize = "col-lg-6";

    // If there are no bullets, main content takes more space, potentially with image
    if (keyFeatures.length === 0) {
        mainContentColSize = "col-lg-7";
        imageColSize = "col-lg-5"; // Image would be smaller next to main content
    }
    // If there are only bullets and no paragraphs, bullets take full width (but center it)
    if (mainContent.length === 0 && keyFeatures.length > 0 && !hasImage) {
        keyFeaturesColSize = "col-lg-8 mx-auto"; // Center the highlight box if it's the only thing
    }


    return (
        // Section with a very light grey background for subtle visual distinction
        <section className="container-fluid bg-light py-2 py-md-5">
            <div className="container">

                {/* Centered, strong title */}
                <h2 className="text-center display-5 mb-5" style={styles.mainTitle} dangerouslySetInnerHTML={{ __html: data?.title }}/>

                <div className="row align-items-center justify-content-center">

                    {/* --- Left Column: Image/Main Content --- */}
                    {(hasImage || isParagraphHeavy) && (
                        <div className={` ${mainContentColSize} mb-4`}>
                            {/* {hasImage && (
                                <div className="text-center text-md-start" style={styles.imageContainer}>
                                    <img
                                        src={data.image}
                                        alt={`Illustration for ${data.title}`}
                                        style={styles.image}
                                        className="img-fluid" // Ensures responsiveness
                                    />
                                </div>
                            )} */}

                            {mainContent.map((p, index) => (
                                <p key={index} className="text-muted mb-3" style={{ ...styles.merriweather, ...styles.extraText }} dangerouslySetInnerHTML={{ __html: p.replace('branchName', data.title.split(' ')[1]) }}>
                                    {/* {p.replace('branchName', data.title.split(' ')[1])} */}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* --- Right Column: Highlighted Key Features (Bullets) --- */}
                    {keyFeatures.length > 0 && (
                        <div className={` mb-4`}>
                            <div
                                style={styles.highlightBox}
                                // Add subtle hover effect directly
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.12)'}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)'}
                            >
                                {keyFeatures.map((item, index) => (
                                    <div key={index} className="d-flex align-items-start mb-3">
                                        {/* Using a star for bullets here, but styled to be subtle and brand-aligned */}
                                        <span className="me-3" style={styles.bulletIcon}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                        </span>
                                        <span className="text-dark" style={styles.merriweather} dangerouslySetInnerHTML={{ __html: item }} />
                                            {/* {item} */}
                                        {/* </span> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.extra && ( // 'extra' typically goes with paragraphs, like in Kolkata
                        <p className="text-muted" style={{ ...styles.merriweather, ...styles.extraText }}>
                            {data.extra}
                        </p>
                    )}

                    {/* --- Fallback Message (if no data at all) --- */}
                    {(!hasImage && !isParagraphHeavy && keyFeatures.length === 0) && (
                        <div className="col-12 text-center">
                            <p className="text-danger fw-bold mt-4">
                                No content available for this city.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseComponent;