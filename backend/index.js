import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
//const sequelize = require("./utils/database"); // your Sequelize instance
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import { sequelize } from "./models/Index.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

// api routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// database connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL connected successfully');
    return sequelize.sync({ alter: false }); // Create/update tables
  })
  .then(() => {
    console.log('✅ Tables synced with MySQL');

    // Start server only after DB is ready
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to MySQL or sync tables:', err);
  });
