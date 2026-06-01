const { registerUser, loginUser } = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: err.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const user = await loginUser(req.body.email, req.body.password);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error while logging user in",
            error: err.message,
        });
    }
};

const trial = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
};

module.exports = { register, login, trial };