import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function ServiceOffer({ branchName }) {

  // --- Style Definitions ---
  const styles = {
    merriweather: {
      fontFamily: "'Merriweather', serif"
    },
    mainTitle: {
      color: "#002349", // Deep brand blue
      fontWeight: 800,
    },
    bulletContainer: {
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: '#fff', // White background for contrast
      marginBottom: '15px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)', // Subtle shadow
      borderLeft: '4px solid #0056b3', // Strong blue left border
      height: '100%',
    },
    bulletIcon: {
      fontSize: "1.4rem",
      color: "#0056b3", // Primary brand blue
    },
    bulletText: {
      fontSize: "1rem",
      color: "#343a40",
      fontWeight: 500,
    }
  };

  // --- Data (Converted to a structured array for easier mapping and icon assignment) ---
  let servicePoints = [
    { icon: "📈", text: "Real-time live rates — no hidden charges" },
    { icon: "🛡️", text: "RBI-authorized forex company" },
    { icon: "🔒", text: "100% secure online transactions" },
    { icon: "🎧", text: "24×7 customer assistance" },
    { icon: "🌍", text: "25+ global currencies available" },
    { icon: "🧾", text: "Transparent billing & instant receipts" },
  ];
  branchName === 'DELHI' && servicePoints.push({ icon: "🚚", text: "Doorstep delivery anywhere in Delhi NCR" })

  return (
    // Use a light background for the section to stand out
    <section className="py-2 bg-light">
      <div className="container">
        <div className="row justify-content-center">

          {/* Main Title - Centered for impact */}
          <div className="col-12 col-lg-10">
            <h2 className="text-center mb-5" style={{ ...styles.merriweather, ...styles.mainTitle }}>
              Why Choose zenithglobal.com.my
            </h2>
          </div>

          {/* Features Grid - Uses two columns on medium screens and up */}
          <div className="col-12 col-lg-10">
            <div className="row">
              {servicePoints.map((point, index) => (
                <div key={index} className="col-sm-6 col-md-4 mb-4">
                  <div style={styles.bulletContainer}>
                    <div className="d-flex align-items-center">

                      {/* Icon */}
                      <div className="flex-shrink-0 me-3">
                        <span style={styles.bulletIcon}>{point.icon}</span>
                      </div>

                      {/* Text */}
                      <div className="flex-grow-1">
                        <span style={styles.bulletText}>{point.text}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Placeholder for the commented-out descriptive paragraph (optional) */}
          {/*
                    <div className="col-12 col-lg-10 mt-4">
                        <p className="text-secondary text-center" style={{ letterSpacing: ".5px" }}>
                             Zenith Global  is one of the India’s leading online marketplace that allows easy currency exchange, forex cards, International Remittances, and travel insurance, etc. Here, you will get suitable way to convert currency online at fair charges...
                        </p>
                    </div>
                    */}

        </div>
      </div>
    </section>
  );
}

export default ServiceOffer