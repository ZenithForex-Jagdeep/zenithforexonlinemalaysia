import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

function Branch_child(props) {
  return (
    <div className="col-md-4">
      <div className="card p-2 addressCardHeader rounded">
        <div className="addressCard">
          <h5 className="my-2">{props.branchname}</h5>
          <p>
            {props.address} <a style={{display: [props.gmaplink == ""&&"none"]}} href={props.gmaplink} target="_blank"><FontAwesomeIcon icon={faLocationDot}/></a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Branch_child