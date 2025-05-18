import { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
  
    useEffect(() => {   
        if (searchedQuery) {
            const [filterType, filterValue] = searchedQuery.includes(':') 
            ? searchedQuery.split(':') 
            : ['', searchedQuery];
            const filteredJobs = allJobs.filter((job) => {
                 if (!filterType) {
                    // return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                //     job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                //     job.location.toLowerCase().includes(searchedQuery.toLowerCase())
                    return (
                    job.title.toLowerCase().includes(filterValue.toLowerCase()) ||
                    job.description.toLowerCase().includes(filterValue.toLowerCase()) ||
                    (job.location && job.location.toLowerCase().includes(filterValue.toLowerCase()))
                    );
            }
            
            // Apply specific filter based on type
            switch(filterType) {
                case 'Location':
                    return job.location && job.location.toLowerCase() === filterValue.toLowerCase();
                case 'Company':
                    return job.company && job.company.toLowerCase() === filterValue.toLowerCase();
                case 'Salary':
                    return checkSalaryRange(job.salary, filterValue);
                default:
                    return true;
            }
        });
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);


    
// Helper function for salary range filtering
const checkSalaryRange = (salary, range) => {
    if (!salary || !range) return false;
    
    const jobSalary = parseFloat(salary);
    if (isNaN(jobSalary)) return false;

    if (range === '0-40k') return jobSalary <= 40000;
    if (range === '42k-1L') return jobSalary > 40000 && jobSalary <= 100000;
    if (range === '1L-5L') return jobSalary > 100000 && jobSalary <= 500000;
    if (range === '5L+') return jobSalary > 500000;
    
    return false;
};

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?.job_id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs