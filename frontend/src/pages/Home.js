import { useEffect, useState } from "react";
import { useJobsContext } from "../hooks/useJobsContext";
import { useAuthContext } from "../hooks/useAuthContext";

//components
import JobDetails from "../components/JobDetails";
import JobForm from "../components/JobForm";

const Home = () => {
  const { jobs, dispatch } = useJobsContext();
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("http://localhost:4000/api/jobs", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_JOBS", payload: json });
      }
    };
    if (user) {
      fetchJobs();
    }
  }, [dispatch, user]);

  // Filter jobs based on search term
  const filteredJobs = jobs?.filter(
    (job) =>
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = () => {
    setShowJobForm((prevState) => !prevState);
  };

  return (
    <div className="home">
      <div className="jobs">
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for job applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-button" onClick={handleSearchClick}>
            + Add a job application
          </button>
        </div>

        {jobs &&
          filteredJobs &&
          filteredJobs.map((job) => <JobDetails key={job._id} job={job} />)}
      </div>
      {showJobForm && <JobForm />}
    </div>
  );
};

export default Home;
