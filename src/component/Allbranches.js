import React, { useEffect } from 'react'
import { Container, Row, Col, Form } from "react-bootstrap";
import * as Common from "./Common";
import Header from "./Header";
import Footer from "./Footer";
import { useState } from 'react';
import Branch_child from './Branch_child';
import _ from "lodash";
import $ from "jquery";
import { MetaTags } from 'react-meta-tags';

function Allbranches() {
    const [branch, setBranch] = useState("A");
    const [onceRun, setOnceRun] = useState(false);
    const [allBranches, setAllBranches] = useState([]);
    const [selectedBranchList, setSelectedBranchList] = useState([]);
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
            Common.callApi(Common.apiGetLocation, ["getallbranches"], (result) => {
                let resp = JSON.parse(result);
                setAllBranches(resp);
                setSelectedBranchList(resp);
            });
            setOnceRun(true);
        }
        Common.getMetaTagsById('Branches Page', setMetaTag);

    }, [onceRun]);

    const handleBranchChange = (v) => {
        $(".loader").show();
        setBranch(v);
        Common.callApi(Common.apiGetLocation, ["bran", v], (result) => {
            let resp = JSON.parse(result);
            if (resp.msg === 1) {
                $(".loader").hide();
                setSelectedBranchList(resp.branchlist);
            }
        });
    }

    return (
        <>
            {/* <MetaTags>
                <link rel="canonical" href="https://www.zenithglobal.com.my/BranchList" />
        </MetaTags> */}
            <MetaTags>
                <title>{metaTag?.title}</title>
                <meta name="description" content={metaTag?.description} />
                <meta name="Keywords" content={metaTag?.keywords} />
                <link rel="canonical" href="https://www.zenithglobal.com.my/BranchList" />
            </MetaTags>
            <Header />
            <Row>
                <div className="footer_header p-2 mb-2"><h2>BRANCHES</h2></div>
            </Row>
            <Container>
                <div className="py-3">
                    <Row>
                        <Col className='col-md-4'>
                            <Form.Select className='my-3' value={branch} onChange={(e) => handleBranchChange(e.target.value)}>
                                <option value="A">All</option>
                                {
                                    allBranches.map(bran => (
                                        <option value={bran.ml_branchcd}>{_.startCase(bran.ml_branch)}</option>
                                    ))
                                }
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                        {
                            selectedBranchList.map(branc => (
                                <>
                                    <Branch_child branchname={branc.ml_branch} address={branc.ml_branchaddress} gmaplink={branc.ml_maplink} branch={true} />
                                </>
                            ))
                        }
                    </Row>
                </div>
            </Container>
            <Footer />
        </>
    )
}

export default Allbranches

