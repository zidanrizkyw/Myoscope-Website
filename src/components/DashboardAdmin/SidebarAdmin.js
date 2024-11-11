import React from "react";
import logo from "../../assets/logo.png"; // Sesuaikan dengan lokasi logo Anda
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function SideBarAdmin() {
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
          MyoScope
        </span>
      </div>
      <hr className="text-dark" />
      <div className="list-group list-group-flush">
        <Link to="/dashboardadmin" className="list-group-item py-2">
          {/* Gunakan Link dan tambahkan to prop untuk navigasi */}
          <i className="fa-solid fa-house fs-5 me-3"></i>
          <span>Dashboard</span>
        </Link>
      </div>
      <div className="list-group list-group-flush">
        <Link to="/listdoctors" className="list-group-item py-2">
          <i className="fa-solid fa-user-doctor fs-5 me-3"></i>
          <span>Doctors</span>
        </Link>
      </div>
      <div className="list-group list-group-flush">
        <Link to="/add-doctor" className="list-group-item py-2">
          <i className="fa-solid fa-plus fs-5 me-3"></i>
          <span>Add Doctor</span>
        </Link>
      </div>
    </div>
  );
}

export default SideBarAdmin;
