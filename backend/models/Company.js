import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import Job from "./Job.js"; // ✅ Import Job model

const Company = sequelize.define("Company", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
    },
    website: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },
    location: {
        type: DataTypes.STRING,
    },
    logo: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    }
}, { timestamps: true });


export default Company;
