import { JobsContext } from "../context/JobContext";
import { useContext } from "react";

export const useJobsContext = () => {
  const context = useContext(JobsContext);

  if (!context) {
    throw Error("useJobsCentext must be used insde an JobsContextProvider");
  }

  return context;
};
