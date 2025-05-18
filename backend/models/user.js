import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const User = sequelize.define("User", {
  userId:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
},
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePhoto: {
    type: DataTypes.STRING,
    defaultValue: "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
  },
  bio: {
    type: DataTypes.STRING,
    defaultValue: "No bio available"
  },
  skills: {
  type: DataTypes.STRING, // Store as string in DB
  get() {
    const rawValue = this.getDataValue('skills');
    return rawValue ? rawValue.split(',') : [];
  },
  set(value) {
    this.setDataValue('skills', 
      Array.isArray(value) ? value.join(',') : value
    );
  }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user"
  },
  resume: {
    type: DataTypes.STRING,
    validate: {
            isUrl: true
        }
  },

}, {
  tableName: "users"
});

export default User;