import React from "react";
import {Container, Row, Col} from "react-bootstrap";

function HeroComp() {
    return(
        <div className="hero min-vh-100 w-100">
            <Container>
                <Row>
                    <Col className="text-black">
                    <h1>Predict & Prevent</h1>
                    <h2>AI - Driven Myocardial Infarction Detection</h2>
                    <p>Myoscope Alert, we're leading the charge in using Machine Learning to prevent Myocardial Infarction. Our Mission is to provide individuals and healthcare professionals with advanced tools for early detection</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default HeroComp;