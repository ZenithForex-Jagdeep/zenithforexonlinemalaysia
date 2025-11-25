import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Data Layer (Moved outside component & refactored for icons) ---
// This is more structured and "attractive" than a simple string array.
const benefitsData = {
    BENGALURU: {
    title: "Benefits of Choosing Zenith Forex Online",
    points: [
      { icon: "💹", title: "Unbeatable Exchange Rates", desc: "We provide some of the best live forex rates in Bangalore, ensuring you always get maximum value." },
      { icon: "💻", title: "100% Online Process", desc: "Exchange your currency online without visiting any physical counter. Book, pay, and track your order from home." },
      { icon: "🚚", title: "Doorstep Delivery Within Hours", desc: "Our fast, city-wide delivery network ensures you receive your foreign currency at your convenience." },
      { icon: "🧾", title: "Transparent Billing & No Hidden Fees", desc: "Every charge is clearly shown. No hidden commissions, no last-minute add-ons. What you see is what you pay." },
      { icon: "🛡️", title: "RBI-Compliant Transactions", desc: "All transactions follow official RBI and FEMA guidelines. We handle your forex needs responsibly and legally." },
      { icon: "🔒", title: "Safe & Secure Payments", desc: "Your data is protected with advanced encryption, so you can transact with complete confidence." },
      { icon: "🎧", title: "Personalized Customer Support", desc: "Our Bangalore-based support team is always ready to assist with rate queries, document guidance, or tracking." },
      { icon: "💳", title: "Multiple Forex Products", desc: "Apart from cash, we offer forex cards, remittance services, and currency buy-back options." }
    ]
  },
  HYDERABAD: {
    title: "Key Benefits of Using Zenith Forex Online in Hyderabad",
    points: [
      { icon: "💹", title: "Transparent & Competitive Rates", desc: "We provide the best rates for currency exchange in Hyderabad with no hidden margins." },
      { icon: "🚚", title: "Doorstep Delivery", desc: "Receive your currency safely at your home, office, or preferred location in Hyderabad." },
      { icon: "💻", title: "Online Convenience", desc: "Complete your money exchange 24/7 without visiting a branch. Our platform is secure and user-friendly." },
      { icon: "🛡️", title: "Safe Transactions", desc: "All payments and document submissions are fully encrypted and RBI-compliant." },
      { icon: "🌍", title: "Extensive Currency Options", desc: "Buy or sell multiple international currencies, including USD, euros, pounds, dirhams, and more." },
      { icon: "🧾", title: "Clear Receipts & Documentation", desc: "Every transaction comes with detailed records for transparency and future reconversion." },
      { icon: "🎧", title: "Dedicated Local Support", desc: "Our Hyderabad-based support team is always available to assist with queries, document guidance, and tracking." }
    ]
  },
  KOLKATA: {
    title: "Benefits You Get with Zenith Forex Online in Kolkata",
    points: [
      { icon: "💸", title: "Best Value for Your Exchange", desc: "We deliver unmatched rates and lower margins, maximizing your foreign exchange value in Kolkata." },
      { icon: "💻", title: "Convenient & Hassle-Free", desc: "No need to visit crowded counters — everything is handled online and delivered to you." },
      { icon: "🛡️", title: "Compliance & Safety First", desc: "All exchanges are done under proper licensing and RBI oversight, giving you total peace of mind." },
      { icon: "💳", title: "Flexible Payment Options", desc: "Use internet banking, UPI, or other trusted digital methods to complete your transaction." },
      { icon: "🧾", title: "Full Documentation & Transparency", desc: "Every trade comes with a clear invoice and record for future reconversion or reference." },
      { icon: "🚚", title: "Fast Execution & Delivery", desc: "Once documents are verified, our team processes your request rapidly to ensure you get your currency soon." }
    ]
  },
  NOIDA: {
    title: "Benefits of Choosing Zenith Forex Online in Noida",
    points: [
      { icon: "💸", title: "Unbeatable Exchange Rates", desc: "We offer the best possible value for your money for currency exchange in Noida." },
      { icon: "✨", title: "Hassle-Free Process", desc: "No waiting lines, no unnecessary paperwork, just a simple online process." },
      { icon: "🔒", title: "Secure Online Payments", desc: "100% encrypted transactions for safe money exchange in Noida." },
      { icon: "🚚", title: "Home Delivery Option", desc: "Get your forex delivered to your doorstep without stepping out." },
      { icon: "🌍", title: "All Major Currencies Available", desc: "USD, EUR, GBP, AED, AUD, SGD, CAD, and more." },
      { icon: "🔒", title: "Rate Lock Option", desc: "Lock in your rate to protect yourself from market fluctuations." },
      { icon: "🛡️", title: "Full RBI Compliance", desc: "We provide services that are legal, authorized, and trustworthy." },
      { icon: "🎧", title: "Friendly Support Team", desc: "Our team is ready to provide assistance whenever you need it." }
    ]
  },
  DELHI: {
    title: "Benefits of Choosing Zenith Forex Online in Delhi",
    points: [
      { icon: "💸", title: "Unbeatable Exchange Rates", desc: "We offer the best possible value for your money for currency exchange in Delhi." },
      { icon: "✨", title: "Hassle-Free Process", desc: "No waiting lines, no unnecessary paperwork, just a simple online process." },
      { icon: "🔒", title: "Secure Online Payments", desc: "100% encrypted transactions for safe money exchange in Delhi." },
      { icon: "🚚", title: "Home Delivery Option", desc: "Get your forex delivered to your doorstep without stepping out." },
      { icon: "🌍", title: "All Major Currencies Available", desc: "USD, EUR, GBP, AED, AUD, SGD, CAD, and more." },
      { icon: "🔒", title: "Rate Lock Option", desc: "Lock in your rate to protect yourself from market fluctuations." },
      { icon: "🛡️", title: "Full RBI Compliance", desc: "We provide services that are legal, authorized, and trustworthy." },
      { icon: "🎧", title: "Friendly Support Team", desc: "Our team is ready to provide assistance whenever you need it." }
    ]
  }
};
// Add a default fallback
benefitsData.DEFAULT = benefitsData.HYDERABAD;


// --- Style Object (CSS-in-JS) ---
const styles = {
  mainTitle: {
    fontFamily: "'Merriweather', serif",
    color: "#002349", // A deep, professional blue
    fontWeight: 700,
  },
  icon: {
    fontSize: "2.5rem",
    lineHeight: 1,
    color: "#0056b3", // Bootstrap's primary blue
  },
  pointTitle: {
    fontFamily: "'Merriweather', serif",
    color: "#002349",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
};

// --- The Component ---
const BenefitsComponent = ({ branchName }) => {
  // Robust data fetching
  const cityKey = branchName?.toUpperCase() || "DEFAULT";
  const data = benefitsData[cityKey] || benefitsData.DEFAULT;

  return (
    // Section with light background for visual separation
    <section className="container-fluid bg-light py-2 py-md-5">
      <div className="container">
        
        {/* A stronger, centered title */}
        <h2 className="text-center display-5 mb-5" style={styles.mainTitle}>
          {data.title}
        </h2>

        {/* Responsive 2-column grid */}
        <div className="row">
          {data.points.map((point, index) => (
            <div key={index} className="col-md-6 mb-4">
              {/* d-flex aligns icon and text */}
              <div className="d-flex align-items-start">
                
                {/* Icon Column */}
                <div className="flex-shrink-0 me-3">
                  <span style={styles.icon}>{point.icon}</span>
                </div>
                
                {/* Text Column */}
                <div className="flex-grow-1">
                  <h5 style={styles.pointTitle}>{point.title}</h5>
                  <p className="text-secondary mb-0">{point.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsComponent;