
const CurrencyExchangeBranch = ({ branchName }) => {
    //     H1 - Currency Exchange in Hyderabad | Zenith Forex Online
    //     H2 - Seamless Money Exchange in Hyderabad for Travellers and Professionals
    // Looking for a fast, secure, and reliable way to handle currency exchange in Hyderabad ? Zenith Forex Online is your trusted partner, offering a modern approach to money exchange in Hyderabad.From students heading abroad to business travelers and holidaymakers, our services are designed to simplify your foreign exchange experience.
    // Hyderabad is a city on the move — with IT professionals, students, and frequent travelers constantly exchanging currencies.At Zenith Forex Online, we ensure you get the best rates, full transparency, and convenient service, so your focus stays on your journey, not your money.
    console.log("branchDetails", branchName);
    const branchDetails = {
        DELHI: {
            title: "Currency Exchange in Delhi | Zenith Forex Online",
            subtitle: "Reliable, Transparent & Hassle-Free Money Exchange in Delhi",
            para1: "Delhi — the capital of India, the city that connects dreams with destinations. From students heading abroad to families planning international vacations and entrepreneurs managing global businesses, Delhi’s pulse beats across borders. And when it comes to currency exchange in Delhi, one name keeps things smooth, secure, and straightforward — Zenith Forex Online",
            para2: "We know how confusing forex can be — comparing rates, handling documents, or figuring out who to trust. That’s exactly why Zenith Forex Online exists: to take the guesswork out of foreign exchange and give you a transparent, quick, and reliable money exchange experience right from your phone or laptop."
        },
        BENGALURU: {
            title: "Currency Exchange in Bangalore | Zenith Forex Online",
            subtitle: "Reliable, Transparent & Hassle-Free Money Exchange in Bangalore",
            para1: "Welcome to<strong> Zenith Forex Online</strong> — where you get great rates, quick service, and a process so simple you’ll wonder why you didn’t try us earlier. Whether you’re flying abroad for leisure, education, business, or medical reasons, we make foreign currency exchange easy, transparent, and stress-free",
            para2: "We understand that when you’re dealing with foreign exchange, trust and timing mean everything. That’s why at Zenith Forex Online, we combine <strong>real-time live rates, secure payment options</strong>, and <strong>doorstep convenience</strong> to give you a seamless experience every single time"
        },
        KOLKATA: {
            title: "Currency Exchange in Kolkata | Zenith Forex Online",
            subtitle: "Reliable, Transparent & Hassle-Free Money Exchange in Kolkata",
            para1: "Looking for a seamless, trustworthy solution for <strong>currency exchange in Kolkata </strong> or <strong>money exchange in Kolkata </strong>? You’re in the right place. At <strong>Zenith Forex Online </strong>, we specialize in making foreign exchange simple, secure, and efficient for travellers, students, business professionals, and expatriates across Kolkata.",
            para2: "Whether you need to convert Indian Rupees to USD, EUR, GBP, AED or back again — our digital-first approach ensures you get the best value, with transparency and convenience built in."
        },
        HYDERABAD: {
            title: "Currency Exchange in Hyderabad | Zenith Forex Online",
            subtitle: "Seamless Money Exchange in Hyderabad for Travellers and Professionals",
            para1: "Looking for a fast, secure, and reliable way to handle<strong> currency exchange in Hyderabad? Zenith Forex Online</strong> is your trusted partner, offering a modern approach to <strong>money exchange in Hyderabad. </strong> From students heading abroad to business travelers and holidaymakers, our services are designed to simplify your foreign exchange experience.",
            para2: "Hyderabad is a city on the move — with IT professionals, students, and frequent travelers constantly exchanging currencies. At Zenith Forex Online, we ensure you get the <strong>best rates, full transparency, and convenient service</strong>, so your focus stays on your journey, not your money."
        },
        NOIDA: {
            title: "Currency Exchange in Noida | Zenith Forex Online",
            subtitle: "Your Trusted Partner for Currency Exchange in Noida",
            para1: "Looking for the most trusted place for <strong>currency exchange in Noida</strong>? Your search ends here. <strong>Zenith Forex Online</strong> makes <strong>money exchange in Noida</strong> quick, easy, and completely transparent. Whether you’re traveling abroad for work, education, or vacation, we bring you the best exchange rates right at your fingertips.",
            para2: "Gone are the days of standing in long queues or running to banks for small forex needs. With <strong>Zenith Forex Online</strong>, you can book your currency exchange in Noida online within minutes and get the cash or forex card delivered to your doorstep — safely and legally"
        }
    };
    console.log("branchDetails", branchDetails?.[branchName]);
    const styles = {
        merriweatherFont: {
            fontFamily: "'Merriweather', serif",
        },
        heading: {
            fontFamily: "'Merriweather', serif",
            color: '#002349', // A deep, professional blue
            fontWeight: 700,
        },
        subheading: {
            fontFamily: "'Merriweather', serif",
            color: '#333', // A softer dark color
            fontWeight: 400,
        },
        paragraph: {
            fontSize: '1.1rem',
            lineHeight: 1.7,
        }
    };
    return (
        // <section className="container py-1">
        //     <h1 className="text-left display-6" style={{ fontFamily: "'Merriweather', serif", }}>
        //         {branchDetails?.[branchName]?.title}
        //     </h1>

        //     <h3 className="text-left mt-3" style={{ fontFamily: "'Merriweather', serif", }}>
        //         {branchDetails?.[branchName]?.subtitle}
        //     </h3>

        //     <p >
        //         {branchDetails?.[branchName]?.para1}<strong>Zenith Forex Online</strong>.
        //     </p>

        //     <p >
        //         {branchDetails?.[branchName]?.para2}
        //     </p>
        // </section>
        <section className="container my-4 my-md-5">
            <div className="bg-light p-4 p-md-5 rounded-3">

                <h1 className="display-5" style={styles.heading}>
                    ✈️ {branchDetails?.[branchName]?.title}
                </h1>

                <h2 className="h4 mt-3" style={styles.subheading}>
                    {branchDetails?.[branchName]?.subtitle}
                </h2>

                <hr className="my-4" />

                <p
                    style={styles.paragraph}
                    dangerouslySetInnerHTML={{
                        __html: branchDetails?.[branchName]?.para1
                    }}
                />
                <p style={styles.paragraph}
                    dangerouslySetInnerHTML={{
                        __html: branchDetails?.[branchName]?.para1
                    }} />
            </div>
        </section>
    );
};

export default CurrencyExchangeBranch;
