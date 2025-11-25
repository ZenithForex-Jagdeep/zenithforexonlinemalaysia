import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Header from '../Header'
import "../../css/gallery.css";
import Footer from '../Footer';
import * as Common from "../Common";
import { MetaTags } from 'react-meta-tags';


function Gallery() {
    const [gallery, setGallery] = useState([]);
    const [onceRun, setOnceRun] = useState(false);
    const [metaTag, setMetaTag] = useState({
        "id": 0,
        "page": "",
        "title": "",
        "description": "",
        "url": "",
        "keywords": ""
    })
    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiGallery, ["getallgallery"], (result) => {
                console.log(result);
                setGallery(JSON.parse(result));
            });
            setOnceRun(true);
            Common.getMetaTagsById('Gallery Page', setMetaTag);
        }
    }, [onceRun]);
    return (
        <>
            <MetaTags>
                <title>{metaTag?.title}</title>
                <meta name="description" content={metaTag?.description} />
                <meta name="Keywords" content={metaTag?.keywords} />
                <link rel="canonical" href="https://www.zenithglobal.com.my/gallery" />
            </MetaTags>
            <Header />
            <div className="p-2 mb-4 footer_header">
                <h3>GALLERY</h3>
            </div>
            <Container>
                <Row className='gallery_section'>
                    {
                        gallery.map(data => (
                            <Col className='col-lg-4 col-6 mb-3'>
                                <img src={"../upload/" + data.tg_photopath} alt="img" />
                                <p className="text-center mt-1" style={{ backgroundColor: "white" }}>{data.tg_desc}</p>
                            </Col>
                        ))
                    }
                </Row>
            </Container>
            <Footer />
        </>
    )
}

export default Gallery
