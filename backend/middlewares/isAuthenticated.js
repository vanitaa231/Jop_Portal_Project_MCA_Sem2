import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Use your own JWT_SECRET
    console.log("Decoded JWT:", decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};

export default isAuthenticated;
