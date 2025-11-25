import React from "react";
import { useNavigate } from "react-router-dom";

function Product_child(props) {
  const navigate = useNavigate();
  const onClickNavigate = () => {
    navigate(props.href);
    window.scrollTo(0, 0);
  }
  return (
    <div className="col-md-4">
      <div style={{ background: "url(" + props.src + ")" }} className="card myCard text-center rounded">
        <div className="cardbody pb-5 mb-2">
          <h4 style={{ color: "white" }} className="fw-bold py-2">{props.header}</h4>
          <p className="px-2 text-white fw-bold">
            {props.text}
          </p>
          <span className="p-2" style={{ border: "1px solid white", cursor: "pointer" }} onClick={() => onClickNavigate()}>Learn more..</span>
        </div>
      </div>
    </div>
  );
}

export default Product_child;



