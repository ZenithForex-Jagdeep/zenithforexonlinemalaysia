import React from "react";

function Customer_reviews({ src, text, name }) {
  return (
    <div className="row p-3 pt-5">
      <div
        className="col-md-12 py-3 rounded testiht"
        style={{ background: "rgba(97, 156, 191,0.5)" }}
      >
        <img
          className="rounded-circle mx-auto"
          src={src}
          style={{
            height: "100px",
            width: "100px",
            marginTop: "-60px",
          }}
        />
        <p className="pt-5">{text}</p>
        <h5 className="text-danger">{name}</h5>
      </div>
    </div>
  );
}

export default Customer_reviews;
