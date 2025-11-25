import React from "react";
import {Row, Col} from "react-bootstrap";

function Documents_req() {
  return (
    <div className="px-2 pb-2 mb-2 docs_req" style={{ border: "5px solid lightgray" }}>
      <Row
        style={{
          textAlign: "center",
          borderBottom: "3px solid lightgray",
        }}
      >
        <h5>
          <b>Documents Required</b>
        </h5>
      </Row>
      <Row>
        <Col className="mt-2">
          <b>
            {" "}
            <ul>
              <li>Valid Passport</li>
              <li>
                Valid Visa (applicable for countries which do not have visa on
                arrival facility)
              </li>
              <li>Confirm returned Air ticket with travel within 60 days</li>
              <li>Valid Pan Card</li>
              <li style={{ color: "blue" }}>A2 Form</li>
              <li>Aadhaar Card</li>
            </ul>
          </b>
        </Col>
      </Row>
    </div>
  );
}

export default Documents_req;
