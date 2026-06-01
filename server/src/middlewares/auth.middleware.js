const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
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