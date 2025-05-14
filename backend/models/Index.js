import sequelize from "../utils/database.js";
import User from "./user.js";
import Company from "./Company.js";
import Job from "./Job.js";
import Application from './Application.js';

// User ↔ Company
User.hasMany(Company, { foreignKey: "userId" });
Company.belongsTo(User, { foreignKey: "userId" });

// Company ↔ Job
Company.hasMany(Job, { foreignKey: "companyId" });
Job.belongsTo(Company, { foreignKey: "companyId", as: "company" });

// User ↔ Job (createdBy)
User.hasMany(Job, { foreignKey: "createdBy" });
Job.belongsTo(User, { foreignKey: "createdBy" });

// Application belongs to a Job
Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

// Application belongs to a User (applicant)
User.hasMany(Application, { foreignKey: 'applicantId' });
Application.belongsTo(User, { foreignKey: 'applicantId' });

export { sequelize, User, Company, Job, Application };