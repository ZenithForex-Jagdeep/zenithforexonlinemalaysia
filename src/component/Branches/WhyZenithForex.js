import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Common from "../Common";

// --- Data Layer (Moved Outside Component) ---
// This is critical for performance. It's now defined once.
// I've also added a relevant 'icon' for each feature.
const content = {
    HYDERABAD: {
        title: "Why Zenith Forex Online Stands Out in Hyderabad",
        data: [
            {
                icon: "💹",
                title: "Competitive Live Rates",
                description: "We update currency rates in real time so you always get the best value. Whether you’re buying US dollars, euros, pounds, or other international currencies, our rates are transparent, fair, and clearly displayed — no surprises.",
            },
            {
                icon: "🛡️",
                title: "Safe, RBI-Compliant Transactions",
                description: "Zenith Forex Online is fully licensed and operates under RBI regulations. Every <strong>money exchange in Hyderabad </strong> is secure, documented, and legally compliant, giving you complete peace of mind.",
            },
            {
                icon: "🚚",
                title: "City-Wide Coverage",
                description: "From Banjara Hills to Gachibowli, Hitech City to Jubilee Hills, we provide fast delivery of foreign currency across Hyderabad. No matter where you are, Zenith Forex Online brings currency to your doorstep or preferred pickup point.",
            },
            {
                icon: "💻",
                title: "Easy Online Process",
                description: "Book your currency online in just a few clicks. Check live rates, enter your required amount, upload documents, and confirm your order — all without stepping out of your home.",
            },
            {
                icon: "🌍",
                title: "Wide Range of Foreign Currencies",
                description: "From popular currencies like USD, GBP, and EUR to AED, SGD, CAD, and JPY, Zenith Forex Online covers a broad spectrum to meet the diverse needs of Hyderabad’s travelers.",
            },
            {
                icon: "🔒",
                title: "Rate Locking Option",
                description: "Lock in favorable rates to protect your money from sudden market fluctuations. This ensures you pay exactly what you planned, regardless of changes in currency rates.",
            },
        ]
    },
    BENGALURU: {
        title: "Why Choose Zenith Forex Online for Currency Exchange in Bangalore?",
        data: [
            {
                icon: "📊",
                title: "Best Live & Transparent Rates",
                description: "Say goodbye to confusing rates and hidden margins. Zenith Forex Online updates currency rates in real time, ensuring you always get the <strong>most competitive value for your money</strong>. What you see on our website is exactly what you pay—no surprises, no hidden charges.",
            },
            {
                icon: "🛡️",
                title: "RBI-Authorized & Secure Transactions",
                description: "Your trust is our priority. Zenith Forex Online operates under the authorization and compliance framework of the Reserve Bank of India (RBI). Every transaction — whether it’s buying or selling foreign currency — follows official RBI guidelines. That means your forex dealings are completely <strong>safe, legal, and traceable. </strong>",
            },
            {
                icon: "🚚",
                title: "Doorstep Delivery Across Bangalore",
                description: "We bring the forex counter to your doorstep! Order your currency online and have it <strong>delivered safely anywhere in Bangalore — be it Whitefield, HSR Layout, Indiranagar, Koramangala, or Electronic City. </strong> No more wasting time in traffic or standing in queues.",
            },
            {
                icon: "📱",
                title: "User-Friendly Online Platform",
                description: "Our website is built for simplicity. You can compare rates, select currencies, upload documents, and complete your transaction in just a few clicks. The platform is mobile-friendly, secure, and available 24/7 — so you can exchange currency anytime, anywhere.",
            },
            {
                icon: "🌍",
                title: "Wide Range of Currencies",
                description: "From USD, EUR, GBP, and AED to AUD, SGD, CAD, and more — <strong>Zenith Forex Online</strong> offers an extensive selection of global currencies. Whether you’re traveling to the USA, the UK, the Middle East, or Europe, we have your currency ready and available.",
            },
            {
                icon: "🔒",
                title: "Rate Locking Feature",
                description: "Don’t want to lose out on a good rate? With our <strong>Rate Locking Option</strong>, you can freeze the exchange rate for a specific period, even if the market fluctuates later. It’s a smart way to protect your money and plan your travel expenses better.",
            },
        ]
    },
    KOLKATA: {
        title: "Why Use Zenith Forex Online for Money Exchange in Kolkata?",
         data: [
            {
                icon: "💹",
                title: "Live Rates & Real-Time Updates",
                description: "We offer live, real-time currency rates. You always see the current fair value — no hidden markups or surprise charges.",
            },
            {
                icon: "🛡️",
                title: "Fully Authorized & RBI Compliant",
                description: "Operating under all RBI (Reserve Bank of India) guidelines, we ensure every transaction is legal, audited, and properly documented.",
            },
            {
                icon: "🚚",
                title: "Doorstep Delivery Across Kolkata",
                description: "From Salt Lake to New Town, Park Street to Howrah, we bring foreign currency to your doorstep or any preferred address in Kolkata.",
            },
            {
                icon: "💻",
                title: "User-Friendly Online Platform",
                description: "You can book your currency exchange from your phone or laptop — select the amount, upload KYC documents, and confirm with just a few clicks.",
            },
            {
                icon: "🌍",
                title: "Wide Currency Selection",
                description: "hether it’s US Dollar, Euro, Pound, Dirham, or other popular currencies, Zenith Forex Online handles them all. We also assist with converting back leftover foreign currencies into INR.",
            },
            {
                icon: "🔒",
                title: "Lock-in Rate Option",
                description: "See a favorable rate? Lock it immediately so that future market fluctuations won’t affect your deal.",
            },
        ]
    },
    NOIDA: {
        title: "Why Zenith Forex Online is the Best Choice for Currency Exchange in Noida",
        data:
            [
                {
                    icon: "📊",
                    title: "Real-Time Rates with No Hidden Fees",
                    description: "At Zenith Forex Online, the <strong>currency exchange in Noida </strong> process is completely transparent. You get to see <strong>live market rates </strong> on our website, updated every few seconds. No middlemen. No hidden margins. Just honest rates and clear billing.",
                },
                {
                    icon: "🛡️",
                    title: "RBI-Authorized Money Exchange",
                    description: "Every transaction made through Zenith Forex Online follows RBI regulations. So, when you choose us for<strong> money exchange in Noida</strong>, you’re not just getting the best deal — you’re choosing a 100% safe and authorized platform that you can rely on.",
                },
                {
                    icon: "🚚",
                    title: "Doorstep Delivery Across Noida",
                    description: "Need foreign currency urgently? We deliver it straight to your home or office anywhere in Noida — whether you’re in Sector 18, Sector 62, Greater Noida, or Noida Extension. That’s how convenient <strong>currency exchange in Noida</strong> can be with Zenith Forex Online.",
                },
                {
                    icon: "📱",
                    title: "Easy Online Booking Process",
                    description: "Forget complex paperwork. With Zenith Forex Online, <strong>money exchange in Noida</strong> is now just a few clicks away. Choose your currency, upload your documents, make the payment, and relax — we’ll take care of the rest.",
                },
                {
                    icon: "💸",
                    title: "Best Rates Guaranteed",
                    description: "We constantly monitor market movements to ensure you get the <strong>best rate for currency exchange in Noida</strong> every single time. Our system even allows you to <strong>lock your preferred rate</strong> for a short time so you don’t lose out when the market fluctuates.",
                },
            ]
    },
    DELHI: {
        title: "The Zenith Forex Advantage",
        data: [
            {
                icon: "💹",
                title: "Competitive Rates You Can Count On",
                description: "Delhi is full of options, but very few give you real-time currency rates without hidden markups. At Zenith Forex Online, we believe you deserve clarity. The rate you see is the rate you get — no commission surprises, no confusing jargon, just clean, fair pricing every time.",
            },
            {
                icon: "🛡️",
                title: "RBI-Authorized & Fully Secure",
                description: "Zenith Forex Online operates under full RBI authorization. Every transaction is carried out in line with India’s foreign exchange regulations, ensuring that your money exchange in Delhi is 100% safe, compliant, and traceable",
            },
            {
                icon: "🚚",
                title: "Doorstep Forex Delivery Across Delhi NCR",
                description: "From Connaught Place to South Delhi, from Noida to Gurgaon — we deliver currency right to your doorstep. No queues, no last-minute rush. You can order online and get your foreign currency or forex card delivered to your home or office the same day.",
            },
            {
                icon: "💻",
                title: "Smart, Simple & Paperless Process",
                description: "We’ve replaced long forms and manual approvals with a fast, digital, and paperless process. In just a few clicks, you can book your currency, upload documents, make payment, and get confirmation — all online.",
            },
            {
                icon: "🌍",
                title: "All Major Global Currencies Available",
                description: "Need US Dollars for a trip to New York? Euros for your study in Germany? Dirhams for your Dubai getaway? We’ve got you covered. Zenith Forex Online offers 25+ currencies to buy or sell, with quick availability across Delhi NCR.",
            },
        ]
    },
};
// Add a default fallback
content.DEFAULT = content.HYDERABAD;

// --- Style Object (CSS-in-JS) ---
// Consolidates styles for easy management.
const styles = {
    merriweather: {
        fontFamily: "'Merriweather', serif",
    },
    mainTitle: {
        fontFamily: "'Merriweather', serif",
        color: "#002349", // A deep, professional blue
        fontWeight: 700,
    },
    itemTitle: {
        fontFamily: "'Merriweather', serif",
        color: "#002349",
        fontSize: "1.25rem", // Slightly larger title for each item
    },
    icon: {
        fontSize: "2.5rem", // Larger icon
        lineHeight: 1,
        color: "#0056b3", // Bootstrap's primary blue
    },
};

// --- The Component ---
const WhyZenithForex = ({ branchName }) => {
    // Robust Fallback:
    // 1. Get the key in uppercase.
    // 2. Default to 'DEFAULT' if branchName is null or undefined.
    // 3. Get the content, or fall back to default content.
    const cityKey = branchName?.toUpperCase() || "DEFAULT";
    const currentContent = content[cityKey]?.data || content.DEFAULT;

    // Use the provided prop for the title, but default to 'Hyderabad' if it's missing
    const displayTitle = content[cityKey]?.title;

    return (
        // Add a light background and more padding to the whole section
        <section className="container-fluid bg-light py-2 py-md-5">
            <div className="container">
                <h2
                    className="text-center display-5 mb-5"
                    style={styles.mainTitle}
                >
                    {displayTitle}
                </h2>

                {/* This is now a responsive grid.
          - 1 column on small screens (default)
          - 2 columns on medium screens (md)
          - 3 columns on large screens (lg)
        */}
                <div className="row">
                    {currentContent.map((item, index) => (
                        // Each item is a column in the grid
                        <div key={index} className="col-md-6 col-lg-4 mb-4">
                            {/* Use d-flex to align icon and text */}
                            <div className="d-flex align-items-start h-100">
                                {/* Icon Column */}
                                <div className="flex-shrink-0 me-3">
                                    <span style={styles.icon}>{item.icon}</span>
                                </div>
                                {/* Text Column */}
                                <div className="flex-grow-1">
                                    <h5 style={styles.itemTitle}>{item.title}</h5>
                                    <p className="text-secondary mb-0" dangerouslySetInnerHTML={{ __html: item?.description }} />

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyZenithForex;