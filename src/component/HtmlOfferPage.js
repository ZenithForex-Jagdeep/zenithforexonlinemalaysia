import { useEffect, useRef } from "react";
import Footer from "./Footer";
import Header from "./Header";

function HtmlOfferPage() {
    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        iframe.onload = () => {
            iframe.style.height =
                iframe.contentWindow.document.body.scrollHeight + "px";
        };
    }, []);
    return (
        <>
            <Header />
            <div>
                <iframe
                    ref={iframeRef}
                    src="/pages/html/offer.html"
                    title="HTML Page"
                    style={{
                        width: '100%',
                        height: '100vh',
                        border: 'none',
                        overflow: 'hidden', // hides scrollbars
                    }}
                ></iframe>
            </div>
            <Footer />
        </>
    );
}

export default HtmlOfferPage;
