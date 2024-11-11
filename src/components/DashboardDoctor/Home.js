import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import "bootstrap/js/dist/dropdown";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Waveform from "../Waveform";

function Home({ Toggle }) {
  const token = localStorage.getItem("token");

  const [detections, setDetections] = useState([]);
  const [countYes, setCountYes] = useState(0);
  const [countNull, setCountNull] = useState(0);
  const [countMI, setCountMI] = useState(0);
  const [countNormal, setCountNormal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState(null);

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [editNotes, setEditNotes] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [rePredictResults, setRePredictResults] = useState([]); // State untuk menyimpan hasil re-predict

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const getDetections = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      let response = await axios.get(
        "https://miocardial.humicprototyping.com/api/detections"
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

  const handleUpdateDetection = async () => {
    try {
      await axios.patch(
        `https://miocardial.humicprototyping.com/api/update-detection/${selectedDetection.patient_id}/${selectedDetection.id}`,
        {
          verified: isVerified ? "yes" : null,
          notes: editNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Tambahkan Content-Type jika perlu
          },
        }
      );
  
      setDetections((prevDetections) =>
        prevDetections.map((detection) =>
          detection.id === selectedDetection.id
            ? {
                ...detection,
                verified: isVerified ? "yes" : null,
                notes: editNotes,
              }
            : detection
        )
      );
  
      setShowModal(false);
    } catch (e) {
      console.log(e.message);
    }
  };
  

  const handleShowModal = (detection) => {
    setSelectedDetection(detection);
    setEditNotes(detection.notes || "");
    setIsVerified(detection.verified === "yes");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDetection(null);
    setRePredictResults([]); // Reset results when closing modal
  };

  const handleShowPatientModal = async (patientId) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      let response = await axios.get(
        `https://miocardial.humicprototyping.com/api/patients/${patientId}`
      );
      setSelectedPatient(response.data.data);
      setShowPatientModal(true);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleClosePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  const handleRePredict = async () => {
    try {
      const wavUrl = `https://miocardial.humicprototyping.com/myocardial_baru/storage/app/public/heartwaves/${selectedDetection.heartwave
        .split("/")
        .pop()}`;

      const response = await axios.get(wavUrl, {
        responseType: "blob",
      });

      const wavFile = new File([response.data], "heartwave.wav", {
        type: "audio/wav",
      });

      const formData = new FormData();
      formData.append("audio", wavFile);

      const rePredictResponse = await axios.post(
        "https://myoscope.humicprototypingapi.online/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const predict = rePredictResponse.data.result;

      // Tambahkan hasil baru ke rePredictResults
      setRePredictResults((prevResults) => [...prevResults, predict]);
      console.log("Re-Predict Results: ", [...rePredictResults, predict]);
    } catch (e) {
      console.log(e.message);
    }
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
        <caption className="text-white fs-4">Latest Diagnoses</caption>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "center" }}>
              No
            </th>{" "}
            {/* Added No column */}
            <th scope="col" style={{ textAlign: "center" }}>
              Timestamp
            </th>
            <th scope="col" style={{ textAlign: "center" }}>
              Patient ID
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
            currentDetections.map((detection, index) => {
              return (
                <tr key={detection.id}>
                  <td style={{ textAlign: "center" }}>
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </td>{" "}
                  {/* Displaying dynamic row number */}
                  <td style={{ textAlign: "center" }}>
                    {detection.created_at}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {detection.patient_id}
                  </td>
                  <td style={{ textAlign: "center" }}>{detection.condition}</td>
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
                      className="fa-solid fa-user px-3"
                      onClick={() =>
                        handleShowPatientModal(detection.patient_id)
                      }
                    ></i>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No detections found.
              </td>
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

      {/* Modal for showing and editing detection details */}
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
                <strong>Patient ID:</strong> {selectedDetection.patient_id}
              </p>
              <p>
                <strong>Condition:</strong> {selectedDetection.condition}
              </p>
              <p>
                <strong>Verified:</strong>{" "}
                {selectedDetection.verified || "Not Verified"}
              </p>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="verifyCheck"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="verifyCheck">
                  Mark as Verified
                </label>
              </div>

              <div className="mt-3">
                <label htmlFor="editNotes" className="form-label">
                  Notes
                </label>
                <textarea
                  className="form-control"
                  id="editNotes"
                  rows="3"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                ></textarea>
              </div>

              {/* Tambahkan tabel hasil re-predict */}
              {rePredictResults && rePredictResults.length > 0 ? (
                <div className="mt-4">
                  <h5>Re-Predict Results</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>No</th> {/* Tambahkan kolom untuk nomor urut */}
                        <th>Condition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rePredictResults.map((predict, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td> {/* Menampilkan nomor urut */}
                          <td>{predict}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No re-predict results available.</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleRePredict}>
            Re-predict
          </button>
          <button className="btn btn-success" onClick={handleUpdateDetection}>
            Save changes
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal for showing patient details */}
      <Modal show={showPatientModal} onHide={handleClosePatientModal}>
        <Modal.Header closeButton>
          <Modal.Title>Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient ? (
            <div>
              <p>
                <strong>ID:</strong> {selectedPatient.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedPatient.name}
              </p>
              <p>
                <strong>Gender:</strong> {selectedPatient.gender}
              </p>
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedPatient.phone}
              </p>
              {/* Add more patient details as needed */}
            </div>
          ) : (
            <p>Loading patient details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleClosePatientModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
