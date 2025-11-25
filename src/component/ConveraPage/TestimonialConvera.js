

"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";


const testimonials = [
    {
        text: "Paying my tuition fees abroad felt overwhelming at first, but Convera made the process so simple. I paid in INR and my university received the exact amount without any deductions. It gave me peace of mind during my first semester overseas.",
        author: "Ritika S., Student, London",
        image: "./Assets/images/profile1.png",
    },
    {
        text: "The best part about using Convera was the exchange rate and the live tracking. I always knew where my money was, and the process was much faster than traditional bank transfers. Definitely a student-friendly service!",
        author: "Aman K., Student, Toronto",
        image: "./Assets/images/profile.png",
    },
    {
        text: "As a parent, sending money abroad can be stressful. With Zenith Global, I was confident that my daughter’s university fees reached on time and safely. The transparency and support made the whole process hassle-free.",
        author: "Rajesh M., Parent of an overseas student",
        image: "./Assets/images/profile.png",
    },
    {
        text: "What I appreciated most was the clarity. No hidden charges, no complicated process — just straightforward fee payment in INR with full credit abroad. It really made things easier for us as parents.",
        author: "Neha P., Parent, New Delhi",
        image: "./Assets/images/profile1.png",
    },
    {
        text: "Both me and my parents were worried about delays and extra costs while paying my fees in Australia. Convera solved that for us. The payment was smooth, quick, and fully transparent — it saved us time, money, and a lot of stress.",
        author: "Shreya T., Student, Melbourne",
        image: "./Assets/images/profile1.png",
    },
    {
        text: "We were worried about exchange rates and hidden charges. Convera’s platform, combined with live tracking, gave us confidence that our son’s tuition was paid safely and on time.",
        author: "Anil & Priya D., Parents (India)",
        image: "./Assets/images/profile.png",
    },
];

// Chunk array for carousel slides
const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

const TestimonialConvera = () => {
    const [slides, setSlides] = useState([]);

    // Determine screen size and chunk accordingly
    const updateSlides = () => {
        const width = window.innerWidth;
        const perSlide = width >= 768 ? 2 : 1; // 2 for desktop, 1 for mobile
        setSlides(chunkArray(testimonials, perSlide));
    };

    useEffect(() => {
        updateSlides();
        window.addEventListener("resize", updateSlides);
        return () => window.removeEventListener("resize", updateSlides);
    }, []);

    return (
        <div className="bg-light py-5">
            <div className="container">
                <h2 className="text-center fw-bold mb-4" style={{ color: "#1761AE" }}>
                    What Our Users Say
                </h2>

                <div
                    id="testimonialCarousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                    data-bs-interval="5000"
                >
                    {/* Indicators */}
                    <div className="carousel-indicators">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                data-bs-target="#testimonialCarousel"
                                data-bs-slide-to={idx}
                                className={idx === 0 ? "active" : ""}
                                aria-current={idx === 0 ? "true" : "false"}
                                aria-label={`Slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Carousel Items */}
                    <div className="carousel-inner">
                        {slides.map((group, idx) => (
                            <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    {group.map((item, i) => (
                                        <div
                                            key={i}
                                            className="d-flex flex-column flex-md-row align-items-center justify-content-start bg-white shadow rounded p-4"
                                            style={{ maxWidth: "600px", width: "100%" }}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.author}
                                                className="rounded-circle me-md-3 mb-3 mb-md-0"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                            />
                                            <div className="d-flex flex-column flex-grow-1">
                                                <p className="fst-italic mb-3">{item.text}</p>
                                                <p className="fw-bold text-primary text-end mb-0">{item.author}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#testimonialCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#testimonialCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestimonialConvera;
