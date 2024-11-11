import React, { useState } from "react";
import axios from "axios";
import Nav from "../DashboardDoctor/Nav";
import "bootstrap/js/dist/dropdown";
import "bootstrap/dist/css/bootstrap.min.css"; // Pastikan Bootstrap CSS terimport

function HomeAddDoctor({ Toggle }) {
  const token = localStorage.getItem("token");

  // State untuk mengelola input form
  const [formData, setFormData] = useState({
    name: "",
    gender: "male", // default value for gender to match API requirements
    specialization: "",
    phone: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fungsi untuk menangani perubahan input form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mengirim data ke API menggunakan axios
      const response = await axios.post(
        "https://miocardial.humicprototyping.com/api/add-doctor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Menetapkan Content-Type untuk JSON
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Doctor registered successfully!");
        setFormData({
          name: "",
          gender: "male",  // Reset nilai default setelah submit
          specialization: "",
          phone: "",
          email: "",
          password: "",
        });
        setError("");
      }
    } catch (err) {
      // Menangani kesalahan dan menampilkan pesan yang sesuai
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to register doctor. Please try again.");
      }
      setSuccess("");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <Nav Toggle={Toggle} />
      <div className="container mt-5 d-flex justify-content-center align-items-center">
        <div className="col-md-8">
          <div
            className="card shadow-lg border-0 rounded-4"
            style={{ backgroundColor: "#fff5f8" }} // Warna latar belakang form dengan tema pink
          >
            <div
              className="card-header text-center text-white mb-4"
              style={{
                backgroundImage: "linear-gradient(to right, #ff4da6, #ff79b0)",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
              }}
            >
              <h3 className="mb-0">Register Doctor</h3>
            </div>
            <div className="card-body p-5">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter doctor's name"
                    required
                    style={{ borderColor: "#ff79b0" }} // Warna border input
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="form-floating mb-4">
                  <select
                    className="form-select"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    style={{ borderColor: "#ff79b0" }} // Warna border input
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <label htmlFor="gender">Gender</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Enter specialization"
                    required
                    style={{ borderColor: "#ff79b0" }} // Warna border input
                  />
                  <label htmlFor="specialization">Specialization</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    style={{ borderColor: "#ff79b0" }} // Warna border input
                  />
                  <label htmlFor="phone">Phone</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                    style={{ borderColor: "#ff79b0" }} // Warna border input
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    style={{ borderColor: "#ff79b0" }} // Warna border input
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  type="submit"
                  className="btn w-100 mt-4"
                  style={{
                    backgroundImage: "linear-gradient(to right, #ff4da6, #ff79b0)",
                    color: "white",
                    fontWeight: "bold",
                    padding: "10px",
                    borderRadius: "30px",
                    transition: "all 0.3s ease",
                  }}
                >
                  Register Doctor
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAddDoctor;
