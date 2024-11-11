import Nav from "../DashboardDoctor/Nav";
import "bootstrap/js/dist/dropdown";
import axios from "axios";
import Modal from "react-bootstrap/Modal"; // Import Modal from react-bootstrap
import React, { useEffect, useState } from "react";

function HomeListDoctor({ Toggle }) {
  const token = localStorage.getItem("token");
  
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // State for selected detection
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  

  const handleShowDeleteModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDoctor(null);
  };

  const getDoctors = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      let response = await axios.get(
        `https://miocardial.humicprototyping.com/api/doctors`
      );
      const data = response.data.data;
      setDoctors(data);

    } catch (e) {
      console.log(e.message);
    }
  };

  const handleDeleteDoctor = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.delete(
        `https://miocardial.humicprototyping.com/api/delete-doctor/${selectedDoctor.id}`
      );
      setDoctors(
        doctors.filter((doctor) => doctor.id !== selectedDoctor.id)
      );
      handleCloseDeleteModal();
    } catch (e) {
      console.log(e.message);
    }
  };

  // Calculate the index of the last and first detection for the current page
  const indexOfLastDoctor = currentPage * rowsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - rowsPerPage;
  const currentDoctors = doctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(doctors.length / rowsPerPage);

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <div className="px-3">
      <Nav Toggle={Toggle} />

      <table class="table caption-top bg-white rounded mt-2">
        <caption className="text-white fs-4">All Doctors</caption>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>No</th>
            <th scope="col" style={{ textAlign: "center" }}>Doctor ID</th>
            <th scope="col" style={{ textAlign: "center" }}>Name</th>
            <th scope="col" style={{ textAlign: "center" }}>Gender</th>
            <th scope="col" style={{ textAlign: "center" }}>Specialization</th>
            <th scope="col" style={{ textAlign: "center" }}>Email</th>
            <th scope="col" style={{ textAlign: "center" }}>Phone</th>
            <th scope="col" style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentDoctors) && currentDoctors.length > 0 ? (
            currentDoctors.map((doctor, index) => {
              return (
                <tr>
                  <td style={{ textAlign: "center" }}>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                  <td style={{ textAlign: "center" }}>{doctor.id}</td>
                  <td style={{ textAlign: "center" }}>{doctor.name}</td>
                  <td style={{ textAlign: "center" }}>{doctor.gender}</td>
                  <td style={{ textAlign: "center" }}>{doctor.specialization}</td>
                  <td style={{ textAlign: "center" }}>{doctor.email}</td>
                  <td style={{ textAlign: "center" }}>{doctor.phone}</td>
                  <td style={{ textAlign: "center" }}>
                    <i
                      class="fa-solid fa-trash"
                      onClick={() => handleShowDeleteModal(doctor)}
                    ></i>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Loading Doctors...</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-end align-items-center mt-3">
        <button
          className="btn btn-dark me-2 mb-2" // Added margin-end for spacing
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="me-3 text-white mb-2">
          Page {currentPage} of {totalPages}
        </span>{" "}
        {/* Added page info */}
        <button
          className="btn btn-dark mb-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      

      {/* Modal for confirming deletion */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Doctor?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteDoctor}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomeListDoctor;
