import React from 'react'
import {Container, Row, Col} from "react-bootstrap";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      
    }
  };

  const imgStyle = {
    width: "168px",
    height: "auto"
}

function Clients() {
  return (
    <Container>
        <Row className='py-5' style={{display: "flex", alignItems: "center"}}>
            <Col className='col-md-4'>
                <h2 style={{fontFamily: "'Merriweather', serif"}}>Our Esteemed Clients</h2>
            </Col>
            <Col className='col-md-8'>
            <Carousel 
                responsive={responsive}
                autoPlay={true}
                infinite={true}
                customTransition="all .8s"
                transitionDuration={500}
                autoPlaySpeed={3000}
                arrows={false}
            >
                <img style={imgStyle} className="mt-3" src="../img/adani-ports.png" alt="" />
                <img style={imgStyle} src="../img/auxilo-logo.svg" alt="" />
                <img style={imgStyle} src="../img/incred.jpeg" alt="" />
                <img style={imgStyle} src="../img/nsdc.jpg" alt="" />
                <img style={imgStyle} src="../img/marriott.jpeg" alt="" />
                <img style={imgStyle} src="../img/leverage-edu.svg" alt="" />
                <img style={imgStyle} src="../img/lemon-tree.jpeg" alt="" />
                <img src="../img/icici.png" alt="" />
                <img src="../img/AVANSE.png" alt="" />
                <img src="../img/BOI.png" alt="" />
                <img src="../img/Canara-Bank.png" alt="" />
                <img src="../img/central-Bank-of-India.png" alt="" />
                <img src="../img/HDFC-bank.png" alt="" />
                <img src="../img/Hyatt.png" alt="" />
                <img src="../img/Novotel-hotels.png" alt="" />
                <img src="../img/Eros-Hotel.png" alt="" />
                {/* <img src="../img/FATEH.png" alt="" /> */}
                {/* <img src="../img/GAAR.png" alt="" /> */}
            </Carousel>
            </Col>
        </Row>
        </Container>
  )
}

export default Clients
