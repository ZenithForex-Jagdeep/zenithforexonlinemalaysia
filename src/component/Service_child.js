import React from "react";

function Service_child(props) {

  const onClickApply = () => {
    window.scrollTo(0, 0);
    if(props.cn){
      props?.func('BUY');
    }else if(props.card){
      props?.func('RELOAD');
    }else if(props.remit){
      props?.func('REMIT');
    } else if(props.facilitation){
      props?.func('FACILITATION');
    }else {
      props.func('showcb');
    }
  }
  return (
    
      <div className="col-md-4">
        <div className="card py-3 rounded text-center">
          <img src={props.src} alt="" />
          <h4 className="text-red font-weight-bold">{props.text}</h4>
          <button
            style={{ fontSize: "16px" }}
            type="button"
            className="btn-blue my-2 btn btn-sm btn-primary"
            onClick={() => onClickApply()}
            >
            Apply Now
          </button>
        </div>
      </div>
    
  );
}

export default Service_child;
