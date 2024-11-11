import Nav from "../DashboardDoctor/Nav";
import "bootstrap/js/dist/dropdown";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import Waveform from "../Waveform"; // Import the Waveform component

function Homepatient({ Toggle }) {
  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("patientId");
  const [detections, setDetections] = useState([]);
  const [countYes, setCountYes] = useState(0);
  const [countNull, setCountNull] = useState(0);
  const [countMI, setCountMI] = useState(0);
  const [countNormal, setCountNormal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wavFile, setWavFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const getDetections = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `https://miocardial.humicprototyping.com/api/detections/${patientId}`
      );
      let data = response.data.data;
      // Sort data by timestamp (created_at) in descending order (newest first)
      data = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setDetections(data);

      // Calculate counts
      const yesCount = data.filter((d) => d.verified === "yes").length;
      const nullCount = data.filter((d) => d.verified === null).length;
      const miCount = data.filter((d) => d.condition === "MI Detected").length;
      const normalCount = data.filter((d) => d.condition === "normal").length;

      setCountYes(yesCount);
      setCountNull(nullCount);
      setCountMI(miCount);
      setCountNormal(normalCount);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleShowModal = (detection) => {
    setSelectedDetection(detection);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDetection(null);
  };

  const handleShowDeleteModal = (detection) => {
    setSelectedDetection(detection);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDetection(null);
  };

  const handleDeleteDetection = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.delete(
        `https://miocardial.humicprototyping.com/api/delete-detection/${patientId}/${selectedDetection.id}`
      );
      setDetections(
        detections.filter((detection) => detection.id !== selectedDetection.id)
      );
      handleCloseDeleteModal();
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleFileChange = (e) => {
    setWavFile(e.target.files[0]);
  };

  const predictAndAddDetection = async () => {
    if (!wavFile) {
      alert("Please select a WAV file");
      return;
    }

    const formData = new FormData();
    formData.append("audio", wavFile); // Pastikan file dikirim dengan key 'file'

    try {
      // Step 1: Predict condition by sending the WAV file to the prediction API
      const predictionResponse = await axios.post(
        "https://myoscope.humicprototypingapi.online/predict", // Use relative path
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Get the prediction result
      const prediction = predictionResponse.data.result;

      // Step 2: Add detection to your API
      const addDetectionFormData = new FormData();
      addDetectionFormData.append("condition", prediction);
      addDetectionFormData.append("heartwave", wavFile); // Mengirim file WAV sebagai heartwave

      // Mengakses API untuk menambahkan deteksi
      await axios.post(
        "https://miocardial.humicprototyping.com/api/add-detection", // Use relative path
        addDetectionFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Detection successfully added");
      handleCloseAddModal(); // Menutup modal setelah sukses
      getDetections(); // Update daftar deteksi setelah penambahan
    } catch (e) {
      console.error("Error during prediction or adding detection:", e.message);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setWavFile(null);
    setPredictionResult("");
  };

  // Calculate the index of the last and first detection for the current page
  const indexOfLastDetection = currentPage * rowsPerPage;
  const indexOfFirstDetection = indexOfLastDetection - rowsPerPage;
  const currentDetections = detections.slice(
    indexOfFirstDetection,
    indexOfLastDetection
  );

  // Change page function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total pages
  const totalPages = Math.ceil(detections.length / rowsPerPage);

  useEffect(() => {
    getDetections();
  }, []);

  return (
    <div className="px-3">
      <Nav Toggle={Toggle} />
      <div className="container-fluid">
        <div className="row g-3 my-2">
          <div className="col-md-3">
            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">{countYes}</h3>
                <h3 className="fs-5">Verified</h3>
              </div>
              <i className="fa-solid fa-check p-3 fs-1"></i>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">{countNull}</h3>
                <h3 className="fs-5">Not Verified</h3>
              </div>
              <i className="fa-regular fa-circle-xmark p-3 fs-1"></i>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">{countMI}</h3>
                <h3 className="fs-5">MI</h3>
              </div>
              <i className="fa-solid fa-triangle-exclamation p-3 fs-1"></i>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded">
              <div>
                <h3 className="fs-2">{countNormal}</h3>
                <h3 className="fs-5">Normal</h3>
              </div>
              <i className="fa-regular fa-heart p-3 fs-1"></i>
            </div>
          </div>
        </div>
      </div>

      <table className="table caption-top bg-white rounded mt-2">
        <caption className="text-white fs-4">
          My Diagnoses
          <button
            className="btn btn-dark mb-1 mx-4"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>
              No
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              Timestamp
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              Detection ID
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              Condition
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              Verified
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentDetections) && currentDetections.length > 0 ? (
            currentDetections.map((detection, index) => (
              <tr key={detection.id}>
                <td style={{ textAlign: "center" }}>
                {index + 1 + (currentPage - 1) * rowsPerPage}
                </td>
                <td style={{ textAlign: "center" }}>
                  {detection.created_at}
                </td>
                <td style={{ textAlign: "center" }}>
                  {detection.id}
                </td>
                <td style={{ textAlign: "center" }}>
                  {detection.condition}
                </td>
                <td style={{ textAlign: "center" }}>
                  {detection.verified === "yes" ? (
                    <i className="fa-solid fa-check"></i>
                  ) : (
                    <i className="fa-regular fa-circle-xmark"></i>
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  <i
                    className="fa-solid fa-pen-to-square px-3"
                    onClick={() => handleShowModal(detection)}
                  ></i>
                  <i
                    className="fa-solid fa-trash"
                    onClick={() => handleShowDeleteModal(detection)}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Loading Detections..</td>
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

      {/* Modal for showing detection details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detection Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDetection && (
            <div>
              <p>
                <strong>Heartwave:</strong>
              </p>
              {selectedDetection.heartwave ? (
                <Waveform
                  audioUrl={`https://miocardial.humicprototyping.com/myocardial_baru/storage/app/public/heartwaves/${selectedDetection.heartwave
                    .split("/")
                    .pop()}`}
                />
              ) : (
                <p>No heartwave file available.</p>
              )}
              <p>
                <strong>Detection ID:</strong> {selectedDetection.id}
              </p>
              <p>
                <strong>Condition:</strong> {selectedDetection.condition}
              </p>
              <p>
                <strong>Verified:</strong>{" "}
                {selectedDetection.verified || "Not Verified"}
              </p>
              <p>
                <strong>Notes:</strong> {selectedDetection.notes || "No Notes"}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal for adding new detection */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Detection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label">
                Upload Heartwave (WAV file):
              </label>
              <input
                type="file"
                className="form-control"
                id="fileInput"
                accept=".wav"
                onChange={handleFileChange}
              />
            </div>
            {predictionResult && <p>Prediction: {predictionResult}</p>}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseAddModal}>
            Close
          </button>
          <button className="btn btn-primary" onClick={predictAndAddDetection}>
            Predict and Add
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal for confirming deletion */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this detection?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDeleteDetection}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Homepatient;
