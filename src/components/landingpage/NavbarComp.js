import React from "react";
import { Container, Navbar, Nav} from "react-bootstrap";
import logo from '../../assets/logo.png'; // Sesuaikan dengan lokasi logo Anda

function NavbarComp() {
  return (
    <div className="sticky-top">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4">
          <img
              src={logo}
              width="50"
              height="40"
              className="d-inline-block align-top"
              alt="Myoscope logo"
            />{' '}
            Myoscope</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-center">
              <Nav.Link href="/login" className="mx-2">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavbarComp;
