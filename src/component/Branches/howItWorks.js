import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Common from "../Common";

// --- Data Layer (Added 'icon' property for visuals) ---
const howItWorksData = {
    DELHI: {
        title: "How Currency Exchange Works at Zenith Forex Online",
        data: [
            {
                icon: "🔍",
                step: "Step 1: Tell Us What You Need",
                description: "Visit our website, select the foreign currency you want to buy or sell, and enter your amount. You’ll instantly see the live currency rate.",
            },
            {
                icon: "🔒",
                step: "Step 2: Review & Confirm Your Rate",
                description: "Check the displayed rate and lock it in. This protects you from rate fluctuations and ensures complete transparency.",
            },
            {
                icon: "📄",
                step: "Step 3: Upload Your Documents",
                description: "Upload ID proof, passport, visa, or air ticket as required by RBI. Our platform is fully encrypted to keep your data safe.",
            },
            {
                icon: "🚚",
                step: "Step 4: Choose Delivery or Pickup",
                description: "Select doorstep delivery or branch pickup — whichever is convenient. We operate across Delhi NCR.",
            },
            {
                icon: "💸",
                step: "Step 5: Make Payment & Get Your Currency",
                description: "Make payment securely and receive confirmation instantly. Your currency or forex card will be delivered quickly.",
            },
        ]
    },
    NOIDA: {
        title: "How to Book Currency Exchange in Noida with Zenith Forex Online",
        data: [
            {
                icon: "🔍",
                step: "Step 1: Choose Your Currency & Amount",
                description: "Select the foreign currency you want to buy or sell and the amount. You’ll instantly see the <strong>best live rate for currency exchange in Noida</strong>.",
            },
            {
                icon: "🔒",
                step: "Step 2: Confirm and Lock Your Rate",
                description: "Happy with the rate? Lock it instantly to avoid any sudden change. This feature ensures you always get the rate you approved.",
            },
            {
                icon: "📄",
                step: "Step 3: Upload Basic Documents",
                description: "For RBI-compliant transactions, upload ID proof such as a Passport, PAN, or Visa. It’s safe, quick, and verified online.",
            },
            {
                icon: "🚚",
                step: "Step 4: Select Delivery or Pickup",
                description: "Get your foreign currency delivered right to your doorstep or pick it up from our authorized counter in Noida — whichever suits you best.",
            },
            {
                icon: "💸",
                step: "Step 5: Pay Securely & Get Your Currency",
                description: "Complete payment through secure online channels. Once verified, your currency or forex card will be ready immediately.",
            },
        ]
    },
    KOLKATA: {
        title: "How It Works: 5 Simple Steps for Currency Exchange in Kolkata/ Money Exchange in Kolkata",
        data: [
            {
                icon: "🔍",
                step: "Step 1: Choose Currency & Amount",
                description: "Select your required currency and enter the amount. Live rates appear instantly.",
            },
            {
                icon: "🔒",
                step: "Step 2: Rate Review & Lock",
                description: "Lock the rate to shield yourself from market swings.",
            },
            {
                icon: "📄",
                step: "Step 3: Upload Documents",
                description: "Upload Passport, PAN, Aadhaar, flight ticket, or visa details as per RBI guidelines.",
            },
            {
                icon: "🚚",
                step: "Step 4: Delivery or Pickup Option",
                description: "Choose delivery to any Kolkata location or pick up from our office.",
            },
            {
                icon: "💸",
                step: "Step 5: Secure Payment & Currency Delivery",
                description: "Pay online or offline and receive your foreign currency with official receipt.",
            },
        ]
    },
    BENGALURU: {
        title: "How It Works — 5 Simple Steps to Exchange Currency in Bangalore",
        data: [
            {
                icon: "🔍",
                step: "Step 1: Choose Your Currency and Amount",
                description: "Select foreign currency and enter the amount to instantly see live rates.",
            },
            {
                icon: "🔒",
                step: "Step 2: Check and Lock the Best Rate",
                description: "Lock your favorable rate immediately to avoid price changes.",
            },
            {
                icon: "📄",
                step: "Step 3: Upload Required Documents",
                description: "Upload documents like Passport, PAN, Aadhaar, Visa, or Air Ticket for verification.",
            },
            {
                icon: "🚚",
                step: "Step 4: Choose Delivery or Branch Pickup",
                description: "Opt for doorstep delivery or visit the nearest branch for quick pickup.",
            },
            {
                icon: "💸",
                step: "Step 5: Make Payment and Receive Currency",
                description: "Pay securely and receive your currency or forex card instantly with receipt.",
            },
        ]
    },
    HYDERABAD: {
        title: "How to Exchange Currency in Hyderabad — Simple 5-Step Guide",
        data: [
            {
                icon: "🔍",
                step: "Step 1: Choose Your Currency",
                description: "Select the currency you need — whether it’s for travel, education, or business purposes. Enter the exact amount and instantly see the live rate.",
            },
            {
                icon: "🔒",
                step: "Step 2: Compare & Lock Your Rate",
                description: "Once you find a rate that works for you, lock it to prevent future changes. This feature is perfect for planning trips in advance or waiting for ticket bookings.",
            },
            {
                icon: "📄",
                step: "Step 3: Upload Required Documents",
                description: "Provide your documents securely — such as passport, visa, PAN, or air tickets — as per RBI guidelines. Our platform verifies them quickly to keep your transaction smooth.",
            },
            {
                icon: "🚚",
                step: "Step 4: Select Delivery or Branch Pickup",
                description: "Decide whether you want <strong>home delivery</strong> or to pick up at one of our Hyderabad locations. We ensure fast, safe, and verified delivery anywhere in the city.",
            },
            {
                icon: "💸",
                step: "Step 5: Complete Payment & Receive Currency",
                description: "Pay securely online or at the branch, then receive your currency along with a transaction receipt. This makes future reconversion or audits hassle-free.",
            },
        ]
    },
};
howItWorksData.DEFAULT = howItWorksData.DELHI;

// --- Style Object (CSS-in-JS) ---
const styles = {
    mainTitle: {
        fontFamily: "'Merriweather', serif",
        color: "#002349",
        fontWeight: 700,
    },
    // This is the main card style
    stepCard: {
        position: 'relative', // Needed for the badge
        border: 'none',
        borderRadius: '1rem', // Softer, more modern corners
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.07)', // A subtle "lifted" shadow
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    // This is the number (1, 2, 3...)
    stepBadge: {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: '50%',
        backgroundColor: '#0056b3', // Primary blue
        color: '#fff',
        fontFamily: "'Merriweather', serif",
        fontWeight: '700',
        fontSize: '1.1rem',
        boxShadow: '0 4px 8px rgba(0, 86, 179, 0.3)',
    },
    // This is the icon (🔍, 🔒...)
    stepIcon: {
        fontSize: '3.5rem',
        color: '#0056b3',
        marginTop: '2rem', // Makes space for the badge
    },
    // This is the title (Choose Currency...)
    stepTitle: {
        fontFamily: "'Merriweather', serif",
        color: '#002349',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        marginTop: '1.5rem',
    },
    stepDescription: {
        fontSize: '0.95rem',
        lineHeight: 1.6,
    },
};

// --- The Component ---
const HowItWorks = ({ branchName }) => {
    const cityKey = branchName?.toUpperCase() || "DEFAULT";
    const steps = howItWorksData[cityKey]?.data || howItWorksData.DEFAULT;
    const title = howItWorksData[cityKey]?.title || howItWorksData.DEFAULT.title;
    const displayCity = Common.formatCity(branchName || "DELHI");

    return (
        // Section with a light background for contrast
        <section className="container-fluid bg-light py-2 py-md-5">
            <div className="container">
                <h2 className="text-center display-5 mb-5" style={styles.mainTitle}>
                    {title}
                </h2>

                {/* A responsive grid:
          - 1 column on small (default)
          - 2 columns on medium
          - 3 columns on large
          - We use 'justify-content-center' to center the cards nicely
        */}
                <div className="row justify-content-center">
                    {steps?.map((item, index) => {
                        // Clean up the title (e.g., "Step 1: Title" -> "Title")
                        const title = item.step.substring(item.step.indexOf(":") + 2);

                        return (
                            // The 'col' defines the grid layout
                            <div key={index} className="col-lg-4 col-md-6 mb-4">

                                {/* The Card: 
                  - h-100 makes all cards in a row the same height.
                  - text-center aligns all content.
                  - p-3 adds padding.
                */}
                                <div
                                    className="h-100 text-center p-3"
                                    style={styles.stepCard}
                                    // Add a hover effect (can't be done in inline styles)
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.07)';
                                    }}
                                >
                                    {/* Step Number Badge */}
                                    <span style={styles.stepBadge}>{index + 1}</span>

                                    {/* Icon */}
                                    <div style={styles.stepIcon}>{item.icon}</div>

                                    {/* Title */}
                                    <h5 style={styles.stepTitle}>{title}</h5>

                                    {/* Description */}
                                    <p className="text-secondary" style={styles.stepDescription} dangerouslySetInnerHTML={{ __html: item.description }}>
                                       
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;