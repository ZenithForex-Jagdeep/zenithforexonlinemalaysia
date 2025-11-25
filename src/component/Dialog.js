import React from "react";
import parse from 'html-react-parser';
import { Modal, Button, Row, Col } from "react-bootstrap";
function Dialog(props) {
  return (
    <div>
      <Modal
        {...props}
        backdrop="static"
        animation={props.callback ? true : false}
        centered>
        <Modal.Header style={{ borderBottom: "none" }} closeButton>
          {
            !props.callback &&
            <Modal.Title>
              <h3>&nbsp;&nbsp;{props.text.title}</h3>
            </Modal.Title>
          }

        </Modal.Header>
        <Row>
          <Col>
            <>
              <p className="mx-3 form-label">
                {parse(props.text.text)}
              </p>
            </>
          </Col>
        </Row>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="outline-success" size="sm" className="btn_admin" onClick={props.onHide}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Dialog;
