
// admin post krega job
import Job from "../models/Job.js";  // Assuming Sequelize model is defined
import { Op } from 'sequelize';
import Company from '../models/Company.js';
import Application from '../models/Application.js';
import { Sequelize} from 'sequelize';


export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.userId;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        // Create a job using Sequelize ORM
        const job = await Job.create({
            title: title.trim(),
            description: description.trim(),
            requirements: requirements.split(",").map(item => item.trim()), // Trim each requirement
            salary: Number(salary),
            location: location.trim(),
            jobType: jobType.trim(),
            experienceLevel: experience.trim(),
            position: position.trim(),
            companyId,
            createdBy: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "Internal Server Error", success: false });
    }
};

// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = (req.query.keyword || "").trim();

        // Sequelize query to search by title or description
        const jobs = await Job.findAll({
            where: {
                [Op.or]: [
                    { title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Job.title')), 'LIKE', `%${keyword.toLowerCase()}%`) },
                    { description: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Job.description')), 'LIKE', `%${keyword.toLowerCase()}%`) }
                  ]
                  
            },
            include: [
                { model: Company, as: 'company' },  // Assuming you have a Company model and defined association
            ],
            order: [['createdAt', 'DESC']]  // Sorting by creation date
        });
       
        if (!jobs.length) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching jobs", success: false });
    }
};
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
      
        // Find job by ID with its associated applications
        const job = await Job.findByPk(jobId, {
            include: [
                { model: Application, as: 'Applications' },  // Assuming you have an Application model and defined association
                { model: Company, as: 'company'}
            ]
        });
  
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching job", success: false });
    }
};

// In your job controller
export const getFilterOptions = async (req, res) => {
  try {
    const jobs = await Job.findAll()
    
    const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))]
    const industries = [...new Set(jobs.map(job => job.company).filter(Boolean))]
    const salaries = ["0-40k", "42k-1L", "1L-5L", "5L+"] // Can make dynamic
    
    res.status(200).json({
      success: true,
      data: { locations, industries, salaries }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}


// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.userId;

        // Find jobs created by the admin
        const jobs = await Job.findAll({
            where: { createdBy: adminId },
            include: [
                { model: Company, as: 'company' }  // Assuming you have a Company model and defined association
            ],
            order: [['createdAt', 'DESC']]  // Sort by createdAt
        });

        if (!jobs.length) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching admin jobs", success: false });
    }
};
// export const saveJobForLater = async (req, res) => {
//   try {
//     const { job_id } = req.body;
//     const userId = req.userId;

//     const user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     await SavedJob.create({ userId, job_id }); // Assuming SavedJob is your model
//     return res.status(200).json({ message: "Job saved successfully." });
//   } catch (err) {
//     console.error("Save job error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
export const saveJobForLater = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.userId;

  try {
    if (!jobId) return res.status(400).json({ message: "Missing jobId" });

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await SavedJob.create({ userId, jobId });

    return res.status(200).json({ message: "Job saved successfully." });
  } catch (error) {
    console.error("Error saving job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
