import { useJobsContext } from "../hooks/useJobsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
import { format } from "date-fns";

const JobDetails = ({ job }) => {
  const { dispatch } = useJobsContext();
  const { user } = useAuthContext();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDeleteButton = async () => {
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

  const handleOpenResumeModal = () => {
    setShowResumeModal(true);
  };

  const handleOpenLetterModal = () => {
    setShowLetterModal(true);
  };

  const handleCloseResumeModal = () => {
    setSelectedFile(null);
    setShowResumeModal(false);
  };

  const handleCloseLetterModal = () => {
    setSelectedFile(null);
    setShowLetterModal(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleGenResumeSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", selectedFile);
    formData.append("job_name", job.job_name);
    formData.append("company_name", job.company_name);
    formData.append("job_description", job.job_description);

    try {
      const response = await fetch(
        "http://localhost:4000/api/gpt/genAIResume",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate AI resume");
      }

      // This will trigger the browser's default download behavior
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored-resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Close the modal after successful download
      handleCloseResumeModal();
    } catch (error) {
      console.error("Error generating AI resume:", error);
      alert("Failed to generate AI resume");
    }
  };

  const handleGenLetterSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", selectedFile);
    formData.append("job_name", job.job_name);
    formData.append("company_name", job.company_name);
    formData.append("job_description", job.job_description);

    try {
      const response = await fetch(
        "http://localhost:4000/api/gpt/genAILetter",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate AI cover letter");
      }

      // This will trigger the browser's default download behavior
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored-letter.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Close the modal after successful download
      handleCloseLetterModal();
    } catch (error) {
      console.error("Error generating AI cover letter:", error);
      alert("Failed to generate AI cover letter");
    }
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
      <div className="job-buttons">
        {job.resume ? (
          <button className="document-button">See Resume</button>
        ) : (
          <button className="document-button" onClick={handleOpenResumeModal}>
            Gen. Resume
          </button>
        )}

        {job.letter ? (
          <button className="document-button">See Cover Letter</button>
        ) : (
          <button className="document-button" onClick={handleOpenLetterModal}>
            Gen. Cover Letter
          </button>
        )}
      </div>
      <span className="material-symbols-outlined" onClick={handleDeleteButton}>
        delete
      </span>

      {showResumeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-x"
              onClick={handleCloseResumeModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2>Generate AI Resume - {job.job_name}</h2>
            <p>Upload Resume:</p>
            <form
              onSubmit={handleGenResumeSubmit}
              className="resume-upload-form"
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
              />
              <p>Job Description:</p>
              <div className="scroll-box">{job.job_description}</div>
              <button type="submit" className="upload-button">
                Generate
              </button>
            </form>
          </div>
        </div>
      )}

      {showLetterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-x"
              onClick={handleCloseLetterModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2>Generate AI Cover Letter - {job.job_name}</h2>
            <p>Upload Resume:</p>
            <form
              onSubmit={handleGenLetterSubmit}
              className="resume-upload-form"
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
              />
              <p>Job Description:</p>
              <div className="scroll-box">{job.job_description}</div>
              <button type="submit" className="upload-button">
                Generate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
