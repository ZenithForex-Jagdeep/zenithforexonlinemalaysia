import React, { useState } from "react";
import "../../css/main.css";
import { Container, Row, Col, Table } from "react-bootstrap";
import * as Common from "../Common";
import { useEffect } from "react";
import Header from "../Header";
import parse from "html-react-parser";
import Blog_callback from "./Blog_callback";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MetaTags } from "react-meta-tags";
import Dialog from "../Dialog";

const Post = () => {
  const sid = sessionStorage.getItem("sessionId");
  const [onceRun, setOnceRun] = useState(false);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [postTime, setPostTime] = useState("");
  const navigate = useNavigate();

  const [myModal, setMyModal] = useState(false);
  const [modalText, setModalText] = useState({
    title: "",
    text: ""
  });
  const { paramTitle } = useParams();
  const pathEnd = window.location.toString().split('/').pop()
  const [pageTitle, setPageTitle] = useState("Zenith Global  Blog | Expert Analysis & Tips");
  const [pageDesc, setPageDesc] = useState("Explore the latest updates, expert insights, and proven strategies in the world of forex with Zenith Global 's blog");


  useEffect(() => {
    if (onceRun) {
      return;
    } else {
      Common.callApi(Common.apiBlogs, ["getpostByTitle", sid, pathEnd], (result) => {
        const resp = JSON.parse(result);
        if (resp.status == 0) {
          setMyModal(true);
          setModalText({ title: "", text: "Unidentified Error. Please contact to administrator" });
        } else {
          setAuthor(resp.author);
          setTitle(resp.title);
          setUrl(resp.imgurl);
          setContent(resp.content);
          setPostTime(resp.date);
          setPageDesc(resp.content.toString().substring(0, 150))
          setPageTitle(resp.title);
        }
      });
      setOnceRun(true);
    }
  }, [onceRun]);

  return (
    <>
      <Dialog show={myModal} text={modalText} onHide={() => setMyModal(false)} />
      <MetaTags>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        {/* <meta name="Keywords" content="Outward Remittance, send money abroad from India, Inward and Outward Remittance, transfer money abroad, money remittance, International Money Transfer" /> */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content="https://www.zenithglobal.com.my/img/GetBannerImage3.jpg" />
      </MetaTags>
      <Header />
      <div className="px-3 py-3" style={{ backgroundColor: "rgb(238,238,238)" }}>
        <Container>
          <Row>
            <Col className="col-lg-1">&nbsp;</Col>
            <Col style={{ backgroundColor: "white" }} className="col-lg-7 col-12">
              <Row>
                <Col>
                  <p className="blog_top">{author}</p>
                </Col>
                <Col>
                  <p className="blog_top">{postTime}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <img className="post_image" src={"../upload/" + url} alt="" />
                </Col>
              </Row>
              <div className="mt-4" style={{ textAlign: "left" }}>
                <Row>
                  <Col>
                    <h3 style={{ color: "#2f2e7e" }}>{title}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p>{parse(content)}</p>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col className="col-lg-3 col-12">
              <span className="blog_gotoallpost mb-2" style={{ fontFamily: "'Roboto Slab', serif" }} onClick={() => navigate("/blog-posts")}>&lt;&lt; Goto all posts</span>
              <Blog_callback />
            </Col>
            <Col className="col-lg-1">&nbsp;</Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Post;
