import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import Company from "./Company.js"; // ✅ Import Company model

const Job = sequelize.define("Job", {
    job_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    requirements: {
        type: DataTypes.TEXT, // changed from ARRAY to TEXT
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('requirements');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('requirements', JSON.stringify(value));
        }
    },
    salary: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    experienceLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
//    company: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
    companyId: { // ✅ Foreign key to link Job with Company
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
});

export default Job;
