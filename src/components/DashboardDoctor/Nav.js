import React from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import axios from "axios";
import logo from "../../assets/logo.png"; // Adjust the logo path as needed
import 'bootstrap/js/dist/dropdown';

function Nav({Toggle}) {

  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLogout = async () => {
    try {
      // Make API request to logout using GET method
      await axios.get("https://miocardial.humicprototyping.com/api/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      // Remove all relevant data from local storage
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("specialization");
      localStorage.removeItem("role");
      localStorage.removeItem("gender");
      localStorage.removeItem("patientId");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("doctorId");
      localStorage.removeItem("phone")

      // Redirect to landing page
      navigate("/"); // Adjust to your actual landing page route
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };



  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-white px-4">
      <i className="fa-solid fa-bars fa fa-justify-left fs-4"  onClick={Toggle}></i>
      <button
        className="navbar-togler d-lg-none"
        type="button"
        data-bs-toggle="collapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      ></button>
      <div className="collapse navbar-collapse" id="collapsibleNavId">
        <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle text-dark"
              href="#"
              id="dropdownId"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Menu
            </a>
            <div className="dropdown-menu" aria-labelledby="dropdownId">
              <a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
