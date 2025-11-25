import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import $ from "jquery";
import Product_child from "./Product_child";

function Products() {
  return (
    <>
      <section className="py-4 mb-4">
        <div className="container">
          <Row>
            <Product_child
              header="Forex Currency"
              text="With the advent of internet and further updates in webspace many old practices are becoming obsolete. Foreign currency exchange as a business cannot stay away from these market ..."
              href="/currency-exchange"
              src="/img/currency1.png"
            />
            <Product_child
              header="Forex Card"
              text="Forex cards are a convenient, safe and smart way to carry and spend money while travelling abroad. Forex card is a pre-paid traveller’s card that is easy to use. It offers you the flexibility..."
              href="/forex-card"
              src="/img/card1.png"
            />
            <Product_child
              header="Remittance"
              text="Outward remittance in India can be described as a transfer of money in foreign exchange by a resident in India to a beneficiary situated outside the country (except Nepal and Bhutan)..."
              href="/money-transfer-service"
              src="/img/remittance1.png"
            />
            <Product_child
              header="Facilitation Services"
              text="At Zenith Holidays, you can pick from the different visa and passport options, from business visa, tourists, visa, student visa to work permit. Want to know why choose Zenith Holidays..."
              href="/facilitation-services"
              src="/img/facilitate1.png"
            />
            <Product_child
              header="Travel Insurance"
              text="Travelling can be fun but at the same time it can become challenging as well. So, before leaving for eventual travel, little planning certainly makes the trip smoother. Overseas Travel Insurance..."
              href="travel-insurance"
              src="/img/insurance1.png"
            />
            <Product_child
              header="Student Lounge"
              text="Studying abroad is a global dream of millions of students. As far as we all understand, education plays a very important role in every person's life today, and sometimes it..."
              href="/student-lounge"
              src="/img/slounge1.png"
            />
          </Row>
        </div>
      </section>
    </>
  );
}

export default Products;
