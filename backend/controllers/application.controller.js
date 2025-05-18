import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/user.js";
import Company from "../models/Company.js";

// Apply to a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.userId;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        // Check if application already exists
        const existingApplication = await Application.findOne({
            where: { jobId, applicantId: userId }
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // Check if job exists
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Create new application
        await Application.create({
            jobId,
            applicantId: userId
        });

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Get all jobs applied by student
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.userId;

        const applications = await Application.findAll({
            where: { applicantId: req.userId },
            order: [['createdAt', 'DESC']],
            include: {
                model: Job,
                include: {
                    model: Company,
                    as: "company",
                }
            }
        });

        if (!applications.length) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }

        return res.status(200).json({
            applications,
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Admin gets all applicants for a job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.job_id;

        const job = await Job.findByPk(jobId, {
            include: [{
                model: Application,
                include: {
                    model: User,
                    as: "applicant"
                },
                order: [['createdAt', 'DESC']]
            }]
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
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Update application status
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.userId;

        if (!status) {
            return res.status(400).json({
                message: "Status is required.",
                success: false
            });
        }

        const application = await Application.findByPk(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};
