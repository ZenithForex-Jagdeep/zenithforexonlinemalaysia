import React, { useState } from "react";
import "../../css/main.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import * as Common from "../Common";
import { useEffect } from "react";
import Header from "../Header";
import { useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import Footer from "../Footer";
import { MetaTags } from "react-meta-tags";

const Allposts = () => {
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const [blogPosts, setBlogPosts] = useState([]);
    const [pageTitle, setPageTitle] = useState("Zenith Forex Online Blog | Expert Analysis & Tips");
    //Zenith Forex Online Blog | Expert Analysis & Tips
    const [pageDesc, setPageDesc] = useState("Explore the latest updates, expert insights, and proven strategies in the world of forex with Zenith Forex Online's blog");

    const sid = sessionStorage.getItem("sessionId");

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            Common.callApi(Common.apiBlogs, ["getallposts", sid], (result) => {
                setBlogPosts(JSON.parse(result));
            });
            setOnceRun(true);
        }
    }, [onceRun])

    const onClickSeeMore = (postno, title,desc) => {
        let lTitle=title.toLowerCase();
        setPageDesc(desc.toString().substring(0,150))
        setPageTitle(title);
        navigate(`/blog/${lTitle.replaceAll(' ', '-')}`);
    }


    return (
        <>
            <MetaTags>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                {/* <meta name="Keywords" content="Outward Remittance, send money abroad from India, Inward and Outward Remittance, transfer money abroad, money remittance, International Money Transfer" /> */}
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc}/>
                <meta property="og:image" content="https://www.zenithforexonline.com/img/GetBannerImage3.jpg" />
            </MetaTags>
            <Header />
            <div className="p-2 footer_header">
                <h3>BLOG</h3>
            </div>
            <div className="p-4" style={{ backgroundColor: "rgb(238,238,238)" }}>
                <Container>
                    <Row>
                        <Col className="col-lg-10 col-sm-12 m-auto">
                            {blogPosts.map((post, index) => (
                                <Row key={index} className="blog_post mb-3">
                                    <Col className={post.bl_posturl !== "" ? "col-md-4 col-12" : null} >
                                        <Row>
                                            <Col>
                                                <p className="blog_top">{post.bl_blogby}</p>
                                            </Col>
                                            <Col>
                                                <p className="blog_top">{post.bl_date}</p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col><h4 style={{ cursor: "pointer", color: "#2f2e7e" }} onClick={() => onClickSeeMore(post.bl_srno, post.bl_title,post.bl_content)}>{post.bl_title}</h4></Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <p>{parse(post.bl_content.substring(0, 350))} <span onClick={() => onClickSeeMore(post.bl_srno, post.bl_title,post.bl_content)} style={{ color: "blue", cursor: "pointer" }}>(See more...)</span></p>
                                            </Col>
                                        </Row>
                                    </Col>
                                    {
                                        post.bl_posturl === "" ?
                                            <>
                                            </> : <>
                                                <Col className="col-md-8 col-12">
                                                    <span style={{ cursor: "pointer" }} onClick={() => onClickSeeMore(post.bl_srno, post.bl_title,post.bl_content)}>
                                                        <img src={"../upload/" + post.bl_posturl} alt="" />
                                                    </span>
                                                </Col>
                                            </>
                                    }

                                </Row>
                            ))}
                        </Col>
                    </Row>
                </Container>
            </div >
            <Footer />
        </>
    );
};

export default Allposts;
