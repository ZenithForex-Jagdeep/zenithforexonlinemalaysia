import React, { useState } from 'react'
import Footer from './Footer';
import Header from './Header';
import {Container, Table} from "react-bootstrap";
import * as Common from "./Common";
import { useEffect } from 'react';
import $, { data } from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Location from './Location';

function RateCard() {
    const [onceRun, setOnceRun] = useState(false);
    const [liveRates, setLiveRates] = useState([]);
    const [location, setLocation] = useState('');
    const [showModal,setShowModal] = useState(false);
    useEffect(() => {
        if(onceRun){
            return;
        }else {
            Common.callApi(
                Common.apiCountry, ["getbranch", sessionStorage.getItem("location")], (result) => {
                  let response = JSON.parse(result);
                  setLocation(response.location);
                }
              );
            setInterval(function callRatesApi() {
                Common.callApi(Common.apiGetRate, ["getLiveRates", sessionStorage.getItem("location")], (result) => {
                    setLiveRates(JSON.parse(result));
                });
                $(".ratecard_table tbody tr td span").css({'backgroundColor': 'green', 'color': 'white'});
                setTimeout(() => {
                    $(".ratecard_table tbody tr td span").css({'backgroundColor': 'transparent', 'transition': "1s ease", 'color': 'black'});
                }, [1000])
                return callRatesApi;
            }(), [40000]);
            setOnceRun(true);
        }
    }, [onceRun]);


    const openLocationBox = ()=> {
        sessionStorage.removeItem("location");
        setShowModal(true);
        // window.location.reload();
      }

  return (
    <>
        {showModal && <Location setShowModal={setShowModal} />}
        <Header />
            <h2 className="text-center" style={{ fontFamily: "'Merriweather', serif" }}>Live Rate Card
                <span className='fs-5 live_rate'> For </span><br />
                <span onClick={() => openLocationBox()} className="fw-bold btn_loc"><FontAwesomeIcon icon={faLocationDot} />{location}</span>
            </h2>
            <Container>
            <div className="ratecard_table py-5">
                <Table bordered responsive>
                    <thead>
                        <tr style={{backgroundColor: "#2f2e7e", color: "white"}}>
                            <th className='text-center'>CURRENCY</th>
                            <th className='text-center' colSpan={2}>BUY RATES</th>
                            <th className='text-center' colSpan={2}>SELL RATES</th>
                            <th className='text-center'>REMITTANCES</th>
                        </tr>
                        <tr style={{backgroundColor: "#ee2b33", color: "white"}}>
                            <th style={{backgroundColor: "#2f2e7e" }}>&nbsp;</th>
                            <th className='text-center'>Cash</th>
                            <th className='text-center'>Card</th>
                            <th className='text-center'>Cash</th>
                            <th className='text-center'>Card</th>
                            <th className='text-center'>Wire Transfer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            liveRates.map(data => (
                                data.mrc_cn_buy == 0 && data.mrc_card_buy == 0 && data.mrc_cn_sell==0 && data.mrc_card_sell==0 && data.mrc_tt_buy ?
                                <></>:
                                <tr>
                                    <td>{"("+data.isd_code+") "+data.isd_name}</td>
                                    <td>{data.mrc_cn_buy==="0"?<></>:data.mrc_cn_buy}</td>
                                    <td>{data.mrc_card_buy==="0"?<></>:data.mrc_card_buy}</td>
                                    <td>{data.mrc_cn_sell==="0"?<></>:data.mrc_cn_sell}</td>
                                    <td>{data.mrc_card_sell==="0"?<></>:data.mrc_card_sell}</td>
                                    <td>{data.mrc_tt_buy==="0"?<></>:data.mrc_tt_buy}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
            </Container>
        <Footer />
    </>
  )
}

export default RateCard;