import { useJobsContext } from "../hooks/useJobsContext";
import { useAuthContext } from "../hooks/useAuthContext";

//date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const JobDetails = ({ job }) => {
    const { dispatch } = useJobsContext();
    const { user } = useAuthContext();
    const handleClick = async () => {
        if (!user) {
            return;
        }
        const response = await fetch(
            "http://localhost:4000/api/jobs/" + job._id,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: "DELETE_JOB", payload: json });
        }
    };

    return (
        <div className="job-details">
            <h4>{job.job_name}</h4>
            <p>
                <strong>Company Name : </strong>
                {job.company_name}
            </p>
            <p>
                <strong>Job Description : </strong>
                {job.job_description}
            </p>
            <p>
                Applied{" "}
                {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                })}
            </p>
            <span className="material-symbols-outlined" onClick={handleClick}>
                delete
            </span>
        </div>
    );
};

export default JobDetails;
