import React from "react";
import logo from "../../assets/logo.png"; // Sesuaikan dengan lokasi logo Anda

function SideBar() {
  return (
    <div className=" sidebar">
      <div className="m-2">
        <i className="bi bi-bootstrap-fill me-3 fs-4"></i>
        <span className=" fs-5">
        <img
          src={logo}
          width="40"
          height="35"
          className="d-inline-block align-top"
          alt="Myoscope logo"
        />
            MyoScope</span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush">
        <a className="list-group-item py-2">
          <i className="fa-solid fa-house fs-5 me-3"></i>
          <span>Dashboard</span>
        </a>
      </div>
    </div>
  );
}

export default SideBar;
