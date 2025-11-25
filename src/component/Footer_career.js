import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Header from './Header'
import { Container, Row, Col, Form, Table, Accordion, Button } from 'react-bootstrap'
import Footer_career_child from './Footer_career_child'
import * as Common from "./Common";

function Footer_career() {
  const [onceRun, setOnceRun] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);


  useEffect(() => {
    if (onceRun) {
      return;
    } else {
      Common.callApi(Common.apiCareer, ["getjobrole"], (result) => {
        setJobRoles(JSON.parse(result));
        console.log(jobRoles)
      });
      setOnceRun(true);
    }
  }, [onceRun]);

  return (
    <>
      <Header />
      <div className="footer_header p-2 mb-5"><h2>CAREERS</h2></div>
      <Container className='mb-5 career_table'>

        <Accordion>
          {jobRoles.map(job => (
            job.mj_close_date != null && job.mj_job_status != 0 ?
              <Footer_career_child jobtitle={job.mj_jobname} joblocation={job.mj_job_location} jobopen={job.mj_open_position} jobno={job.mj_jobno} /> :
              null
          ))}
        </Accordion>
      </Container >
      <Footer />
    </>
  )

}

export default Footer_career
