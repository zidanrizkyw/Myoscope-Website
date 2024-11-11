import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import logoclock from '../../assets/clock.png'; // Sesuaikan dengan lokasi logo Anda
import logoml from '../../assets/machine_learning.png'; // Sesuaikan dengan lokasi logo Anda
import logodevice from '../../assets/multi_device.png'; // Sesuaikan dengan lokasi logo Anda

function ServiceComp() {
  return (

    <div className="service min-vh-75 d-flex">
      <Container>
        <Row className="row-cols-lg-3 row-cols-md-2 row-cols-1 pt-4 justify-content-center">
          <Col className="text-center px-3 py-5">
            <img
              src={logoclock}
              className="w-25"
              alt="clock logo"
            />
            <h1 className="pt-3">RealTime</h1>
            <p>Provide Realtime diagnosis data to the user</p>
          </Col>
          <Col className="text-center px-3 py-5">
            <img
              src={logoml}
              className="w-25 "
              alt="ML logo"
            />
            <h1 className="pt-3">Machine Learning</h1>
            <p>Provide predictive diagnosis based on machine learning algorithm</p>
          </Col>
          <Col className="text-center px-3 py-5">
            <img
              src={logodevice}
              className="w-25"
              alt="Device logo"
            />
            <h1 className="pt-3">Multi Platform</h1>
            <p>Based on web and mobile platform, our system is accesssible from anywhere</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ServiceComp;
