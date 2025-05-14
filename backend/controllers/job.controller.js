
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
                { model: Application, as: 'applications' }  // Assuming you have an Application model and defined association
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
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;

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
