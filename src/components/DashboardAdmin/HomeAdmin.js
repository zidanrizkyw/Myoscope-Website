import Nav from "../DashboardDoctor/Nav";
import "bootstrap/js/dist/dropdown";
import axios from "axios";
import Modal from "react-bootstrap/Modal"; // Import Modal from react-bootstrap
import React, { useEffect, useState } from "react";

function HomeAdmin({ Toggle }) {
  const token = localStorage.getItem("token");
  
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null); // State for selected detection
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  

  const handleShowDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedPatient(null);
  };

  const getPatients = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      let response = await axios.get(
        `https://miocardial.humicprototyping.com/api/patients`
      );
      const data = response.data.data;
      setPatients(data);

    } catch (e) {
      console.log(e.message);
    }
  };

  const handleDeletePatient = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.delete(
        `https://miocardial.humicprototyping.com/api/delete-patient/${selectedPatient.id}`
      );
      setPatients(
        patients.filter((patient) => patient.id !== selectedPatient.id)
      );
      handleCloseDeleteModal();
    } catch (e) {
      console.log(e.message);
    }
  };

  // Calculate the index of the last and first detection for the current page
  const indexOfLastPatient = currentPage * rowsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - rowsPerPage;
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(patients.length / rowsPerPage);

  useEffect(() => {
    getPatients();
  }, []);

  return (
    <div className="px-3">
      <Nav Toggle={Toggle} />

      <table class="table caption-top bg-white rounded mt-2">
        <caption className="text-white fs-4">All Patients</caption>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>No</th>
            <th scope="col" style={{ textAlign: "center" }}>Patient ID</th>
            <th scope="col" style={{ textAlign: "center" }}>Name</th>
            <th scope="col" style={{ textAlign: "center" }}>Gender</th>
            <th scope="col" style={{ textAlign: "center" }}>Email</th>
            <th scope="col" style={{ textAlign: "center" }}>Phone</th>
            <th scope="col" style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentPatients) && currentPatients.length > 0 ? (
            currentPatients.map((patient, index) => {
              return (
                <tr>
                  <td style={{ textAlign: "center" }}>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                  <td style={{ textAlign: "center" }}>{patient.id}</td>
                  <td style={{ textAlign: "center" }}>{patient.name}</td>
                  <td style={{ textAlign: "center" }}>{patient.gender}</td>
                  <td style={{ textAlign: "center" }}>{patient.email}</td>
                  <td style={{ textAlign: "center" }}>{patient.phone}</td>
                  <td style={{ textAlign: "center" }}>
                    <i
                      class="fa-solid fa-trash"
                      onClick={() => handleShowDeleteModal(patient)}
                    ></i>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Loading Patients...</td>
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
        <Modal.Body>Are you sure you want to delete this Patient?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeletePatient}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomeAdmin;
