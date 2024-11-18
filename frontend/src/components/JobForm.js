import { useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const JobForm = () => {
  const { dispatch } = useJobsContext();
  const { user } = useAuthContext();
  const [job_name, setjob_name] = useState("");
  const [company_name, setcompany_name] = useState("");
  const [job_description, setjob_description] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const job = { job_name, company_name, job_description };

    const response = await fetch("http://localhost:4000/api/jobs", {
      method: "POST",
      body: JSON.stringify(job),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setjob_name("");
      setcompany_name("");
      setjob_description("");
      setError(null);
      setEmptyFields([]);
      console.log("new job added", json);
      dispatch({ type: "CREATE_JOB", payload: json });
    }
  };
  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Job</h3>

      <label>Job Name</label>
      <input
        type="text"
        onChange={(e) => setjob_name(e.target.value)}
        value={job_name}
        className={emptyFields.includes("job_name") ? "error" : ""}
      />

      <label>Company Name</label>
      <input
        type="text"
        onChange={(e) => setcompany_name(e.target.value)}
        value={company_name}
        className={emptyFields.includes("company_name") ? "error" : ""}
      />

      <label>Job Description</label>
      <input
        type="text"
        onChange={(e) => setjob_description(e.target.value)}
        value={job_description}
        className={emptyFields.includes("job_description") ? "error" : ""}
      />

      <button>Add Job</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default JobForm;
