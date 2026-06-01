const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if (!user) throw new Error("User not found");
            req.user = user;
            next();
        } else {
            throw new Error("Not authorized");
        }
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Not authorized",
            error: err.message,
        });
    }
};

module.exports = { protect };