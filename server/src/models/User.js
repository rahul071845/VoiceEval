const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 50
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password:{
            type: String,
            required: true,
            minLength: 6,
            select: false
        },
        role:{
            type: String,
            enum: ["candidate"],
            default: "candidate"
        },
    },
    {
        timestamps: true,
    }
)

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);