import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Application = sequelize.define("Application", {

    status:{
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        default:'pending'
    }
},{timestamps:true});
export default Application;