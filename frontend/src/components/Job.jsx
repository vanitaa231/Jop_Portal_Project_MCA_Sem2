// import { useState } from 'react'    
import axios from 'axios'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types';
//import { toast } from 'react-toastify';

const Job = ({job}) => {
        const navigate = useNavigate();
     //   const [loading, setLoading] = useState(false);
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    const handleSaveForLater = async () => {
  try {
    const response = await axios.post("http://localhost:3000/api/v1/jobs/save", {
      jobId: job.job_id, // use the current job's ID
    }, {
      withCredentials: true
    });

    console.log("Saved:", response.data);
    alert("Job saved for later!");
  } catch (error) {
    console.error("Error saving job:", error);
    alert("Failed to save job.");
  }
};
// const fetchJobDetails = async (job_id) => {
//   try {
//     if (!job_id) {
//             throw new Error("Job ID is missing");
//         }
//     const res = await axios.get(`http://localhost:3000/api/v1/job/getById/${job_id}`, {
//       withCredentials: true,
//     });
//     console.log("Fetched Job:", res.data);
//     // setSelectedJob(res.data); // Removed undefined state update
//   } catch (err) {
//    console.error("Error details:", {
//             message: err.message,
//             jobId: job_id,
//             response: err.response?.data
//         });
//         toast.error(err.response?.data?.message || "Failed to load job details");
//   }
// };

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
                <p className='text-sm text-gray-600'>{job?.createdAt.split("T")[0]} to {job?.closingAt.split("T")[0]}</p>
                
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                {/* <Button onClick={() => {if (job?.job_id) {fetchJobDetails(job.job_id);} else {console.error("Missing job ID");}
  }} variant="outline">Details</Button> */}
                <Button onClick={()=> navigate(`/description/${job?.job_id}`)} variant="outline">Details</Button>
                <Button onClick={handleSaveForLater} className="bg-[#7209b7]">Save For Later</Button>
            </div>
        </div>
    )
}
Job.propTypes = {
    job: PropTypes.shape({
        job_id: PropTypes.number, // Added job_id to prop types
        createdAt: PropTypes.string,
        closingAt: PropTypes.string,
        company: PropTypes.shape({
            logo: PropTypes.string,
            name: PropTypes.string,
        }),
        title: PropTypes.string,
        description: PropTypes.string,
        position: PropTypes.number,
        jobType: PropTypes.string,
        salary: PropTypes.string,
       // _id: PropTypes.string,
    }).isRequired,
};

export default Job;
//                   