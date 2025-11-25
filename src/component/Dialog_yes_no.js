import React from 'react';
import parse from 'html-react-parser';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';

let dialogStyles = {
  width: '500px',
  maxWidth: '100%',
  margin: '0 auto',
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%,-50%)',
  zindex: '999',
  backgroundColor: '#fff',
  padding: '10px 20px 40px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 0 40px 20px rgba(0,0,0,0.26)'
};

let dialogCloseButtonStyles = {
  marginBottom: '15px',
  padding: '3px 8px',
  cursor: 'pointer',
  borderRadius: '50%',
  border: 'none',
  width: '30px',
  height: '30px',
  fontWeight: 'bold',
  alignSelf: 'flex-end'
}

function DialogYesNo(props) {
  let dialog = (
    <div style={dialogStyles}>
      <button style={dialogCloseButtonStyles} onClick={props.onNo}><FontAwesomeIcon icon={faWindowClose} /></button>
      <div>
        {parse(props.children)}
      </div>
      <br></br>
      <div style={{ "textAlign": "center" }}>
        <Button variant="outline-success" className='buttonStyle' size="sm" onClick={props.onYes}  >Yes</Button>&nbsp;&nbsp;
        <Button variant="outline-success" className='buttonStyle' size="sm" onClick={props.onNo}  >No</Button>&nbsp;&nbsp;
      </div>
    </div>
  );

  if (!props.isOpen) {
    dialog = null;
  }


  return (
    <div>
      {dialog}
    </div>
  );
}

export default DialogYesNo;