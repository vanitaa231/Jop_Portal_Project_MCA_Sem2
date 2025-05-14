import  User  from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role  } = req.body;
        const file = req.file;
        if (!fullname || !email || !phoneNumber || !password || !role || !req.file) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
          
        };
       

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profilePhoto: cloudResponse.secure_url,  // save cloudinary URL
            
        });
        console.log("Creating user...");
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        console.error("Register Error:", error);
        res.status(500).json({
            
            message: "Error occurred during registration.",
            success: false
        });
    }
}

// login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user.userId,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("JWT Token Generated:", token);
    // ✅ Create a safe user object to return (not raw Sequelize instance)
    const userData = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: {
        profilePhoto: user.profilePhoto || "",
        bio: user.bio || "",
      },
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome back ${user.fullname}`,
        user: userData,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error occurred during login.",
      success: false,
    });
  }
};

//logout
export const logout = async (req, res) => {
    try {
      console.log("This is logout block :",req.userId);
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true

        })
    } catch (error) {
        console.log(error);
    }
}

//update profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.userId; // Assuming you have middleware for authentication
        let user = await User.findByPk(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        if (cloudResponse) {
            user.profilePhoto = cloudResponse.secure_url; // Save the cloudinary URL
        }

        await user.save();

        user = {
            id: user.id,  // Use `id` for Sequelize
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profilePhoto: user.profilePhoto
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occurred while updating profile.",
            success: false
        });
    }
}
