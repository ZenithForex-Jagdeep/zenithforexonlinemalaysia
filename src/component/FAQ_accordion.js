import React from 'react'
import { Accordion } from 'react-bootstrap'

function FAQ_accordion({eventkey, header, bodytext}) {
  return (
        <Accordion.Item eventKey={eventkey}>
            <Accordion.Header>{header}</Accordion.Header>
            <Accordion.Body>
                {bodytext}
            </Accordion.Body>
        </Accordion.Item>   
  )
}

export default FAQ_accordion
