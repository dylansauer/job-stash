import { useJobsContext } from "../hooks/useJobsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { format } from "date-fns";

const JobDetails = ({ job }) => {
  const { dispatch } = useJobsContext();
  const { user } = useAuthContext();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState(null);

  const handleClick = async () => {
    if (!user) {
      return;
    }
    const response = await fetch("http://localhost:4000/api/jobs/" + job._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_JOB", payload: json });
    }
  };

  const handleAddAIResume = () => {
    setShowResumeModal(true);
    console.log("test");
    // to-do
  };

  const handleAddAICover = (fileUrl) => {
    // Open the file in a new tab
    window.open(fileUrl, "_blank");
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setUploadedPdfUrl(null);
    setShowResumeModal(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    setUploadedPdfUrl(selectedFile);
  };

  return (
    <div className="job-details">
      <h4>{job.job_name}</h4>
      <p>
        <strong>{job.company_name}</strong>
      </p>
      <p>Added on {format(new Date(job.createdAt), "MM/dd/yyyy")}</p>
      <p>
        <strong>
          <a
            href={job.job_posting}
            target="_blank"
            rel="noopener noreferrer"
            className="job-link"
          >
            View Job Posting
          </a>
        </strong>
      </p>
      <div className="document-buttons">
        {job.resume ? (
          <button className="document-button">See Resume</button>
        ) : (
          <button className="document-button" onClick={handleAddAIResume}>
            Add Resume
          </button>
        )}

        {job.letter ? (
          <button className="document-button">See Cover Letter</button>
        ) : (
          <button className="document-button">Add Cover Letter</button>
        )}
      </div>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>

      {showResumeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-x"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2>Add AI Resume</h2>

            <form onSubmit={handleFileUpload} className="resume-upload-form">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
              />
              <button type="submit" className="upload-button">
                Upload Resume
              </button>
            </form>
            {uploadedPdfUrl && (
              <div className="pdf-viewer">
                <h3>Uploaded Resume</h3>
                <iframe
                  src={uploadedPdfUrl}
                  width="100%"
                  height="500px"
                  title="Uploaded Resume"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
