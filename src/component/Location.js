import React, { useEffect, memo, useContext } from "react";
import * as Common from "./Common";
import { Container, Form, Modal, CloseButton } from "react-bootstrap";
import { useState } from "react";
import 'react-datalist-input/dist/styles.css';
import Requestcallback from "./Requestcallback";
import Select from "react-select";
import { useParams } from "react-router-dom";


function Location(props) {
    const { locid } = useParams();
    const [countries, setCountries] = useState([]);
    const [show, setShow] = useState(true);
    const [showCallback, setShowCallback] = useState(false);
    const [searchBoxBranches, setSearchBoxBranches] = useState([]);
    const [searchBranch, setSearchBranch] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handleLocationChange(v) {
        if (v === "") {
            return;
        } else {
            sessionStorage.setItem("location", v);
            window.location.reload();
            setShow(false);
        }
    }

    const hideCallbackModal = (status) => {
        setShowCallback(status);
    }

    const handleCloseButton = () => {
        sessionStorage.location = 14;
        setShow(false);
        window.location.reload();
    }


    useEffect(() => {
        setShow(locid == null && props.showLocModal);
        // if (!countries || countries.length === 0) {
        Common.callApi(Common.apiGetLocation, ["locForModel"], (result) => {
                setCountries(JSON.parse(result));
            });
        // }
        // if (!searchBoxBranches || searchBoxBranches.length === 0) {
            Common.callApi(Common.apiGetLocation, ["getlocforselect"], (result) => {
                setSearchBoxBranches(JSON.parse(result));
            });
        // }
        Common.callApi(Common.apiGetLocation, ["locbyname", locid], result => {
            let resp = JSON.parse(result);
            if (resp > 0) sessionStorage.setItem("location", resp);
        });
    }, [locid]);

    return (
        <>
            <Requestcallback show={showCallback} onHide={() => setShowCallback(false)} func={hideCallbackModal} />
            <Modal  backdrop="static" size='xl' keyboard={false} show={show} onHide={handleClose}>
                <Modal.Header>
                    <h5 style={{ color: "#2f2e7e" }} className="fw-bold">Select Location</h5>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <button type="button" onClick={() => setShowCallback(true)} className="btn btn-small btn-red">
                            Request Call Back
                        </button>
                        <CloseButton onClick={handleCloseButton} />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Select value={searchBranch} defaultValue={null} options={searchBoxBranches} onChange={v => { handleLocationChange(v.value); setSearchBranch(v); }} />
                    <ul className="mt-2 modddal">
                        {
                            countries.map(c => (
                                <li className="fw-bold btn_loc"  onClick={() => handleLocationChange(c.ml_branchcd)}>{c.ml_branch}</li>
                            ))
                        }
                    </ul>
                </Modal.Body>
                {/* <Modal.Footer>
              <Button onClick={() => saveChanges()} variant="primary">Save changes</Button>
            </Modal.Footer> */}
            </Modal>
        </>
    );
}

export default memo(Location);
