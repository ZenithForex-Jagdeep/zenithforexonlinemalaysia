import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const countries = [
    { name: "USA", flag: "https://flagcdn.com/us.svg" },
    { name: "UK", flag: "https://flagcdn.com/gb.svg" },
    { name: "New Zealand", flag: "https://flagcdn.com/nz.svg" },
    { name: "France", flag: "https://flagcdn.com/fr.svg" },
    { name: "Germany", flag: "https://flagcdn.com/de.svg" },
    { name: "Italy", flag: "https://flagcdn.com/it.svg" },
    { name: "Canada", flag: "https://flagcdn.com/ca.svg" },
    { name: "Japan", flag: "https://flagcdn.com/jp.svg" },
    { name: "India", flag: "https://flagcdn.com/in.svg" },
];

export default function ConveraCountry() {
    const scrollRef = useRef(null);
    const [startIndex, setStartIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(getCountByScreen());

    function getCountByScreen() {
        const width = window.innerWidth;
        if (width >= 1200) return 8;      // Desktop
        if (width >= 768) return 6;       // Tablet
        return 4;                         // Mobile
    }

    useEffect(() => {
        const handleResize = () => {
            setVisibleCount(getCountByScreen());
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleNext = () => {
        setStartIndex((prevIndex) => (prevIndex + visibleCount) % countries.length);
    };

    const handlePrev = () => {
        setStartIndex((prevIndex) => {
            return (prevIndex - visibleCount + countries.length) % countries.length;
        });
    };

    const getVisibleCards = () => {
        const visible = [];
        for (let i = 0; i < visibleCount; i++) {
            visible.push(countries[(startIndex + i) % countries.length]);
        }
        return visible;
    };

    return (
        <div className="bg-primary text-white py-5">
            <div className="container text-center">
                <h1 className="fw-bold mb-4">Send Money To Target Country</h1>
                <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                    <button className="btn btn-light rounded-circle shadow" onClick={handlePrev}>
                        &larr;
                    </button>

                    <div className="d-flex gap-4 justify-content-center align-items-center flex-wrap" ref={scrollRef}>
                        {getVisibleCards().map((card, index) => (
                            <div className="d-flex flex-column align-items-center" key={index}>
                                <div
                                    className="bg-white rounded-4 d-flex align-items-center justify-content-center shadow"
                                    style={{ width: "80px", height: "60px", padding: "10px" }}
                                >
                                    <img
                                        src={card.flag}
                                        alt={card.name}
                                        style={{
                                            width: "60px",
                                            height: "40px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                                <h6 className="text-white mt-2">{card.name}</h6>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-light rounded-circle shadow" onClick={handleNext}>
                        &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
}
