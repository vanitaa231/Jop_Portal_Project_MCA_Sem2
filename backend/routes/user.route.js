import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

//
try{
    router.route("/register").post(singleUpload,register);
    router.route("/login").post(login);
    router.route("/logout").get(logout);
    router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
}
catch (error) {
    console.error("Register Error:", error.message);
    console.error(error.stack);
    res.status(500).json({
        message: "Error occurred during registration.",
        success: false
    });
}


export default router;

