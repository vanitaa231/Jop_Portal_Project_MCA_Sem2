import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState(null);  // To handle error state

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });

        console.log(res.data);

        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application));
          setAppliedJobs(res.data.application);  // Set the applied jobs
        }
      } catch (err) {
        setError('Failed to fetch applied jobs. Please try again later.');
        console.log(err);  // Log the error for debugging
      }
    };

    fetchAppliedJobs();
  }, [dispatch]); // Ensure `dispatch` is part of the dependency array

  return { appliedJobs, error }; // Return both appliedJobs and error states
};

export default useGetAppliedJobs;
