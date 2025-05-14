import Company from "../models/Company.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Op } from "sequelize";

// Register a new company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if company already exists
        let company = await Company.findOne({ where: { name: companyName } });

        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        // Create new company
        company = await Company.create({
            name: companyName,
            userId: req.userId
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error registering company", success: false });
    }
};

// Get all companies created by logged-in user
export const getCompany = async (req, res) => {
    try {
        const userId = req.userId;

        const companies = await Company.findAll({ where: { userId } });

        if (!companies.length) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving companies", success: false });
    }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findByPk(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching company", success: false });
    }
};

// Update company
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const companyId = req.params.id;

        const company = await Company.findByPk(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Upload file to cloudinary if it exists
        let logo;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        // Update company details
        await company.update({
            name: name || company.name,
            description: description || company.description,
            website: website || company.website,
            location: location || company.location,
            logo: logo || company.logo
        });

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating company", success: false });
    }
};
