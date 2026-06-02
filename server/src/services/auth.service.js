const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (userData) => {
   const { name, email, password } = userData;
   if (!name || !email || !password) throw new Error('All fields are required');
   const userExists = await User.findOne({ email });
   if (userExists) throw new Error("Email already registered");
   const salt = await bcrypt.genSalt(10);
   const hashedPass = await bcrypt.hash(password, salt);
   const newUser = await User.create({ name, email, password: hashedPass });
   if (!newUser) throw new Error('Failed to create new user.');
   const token = generateToken(newUser._id);
   return {
      user: {
         id: newUser._id,
         name: newUser.name,
         email: newUser.email
      },
      token
   }
};

const loginUser = async (email, password) => {
   if (!email || !password) throw new Error('Email and password are required.');
   const user = await User.findOne({ email }).select("+password");
   if (!user) throw new Error("Invalid credentials.");
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) throw new Error("Invalid credentials.");
   const token = generateToken(user._id);
   return {
      user: {
         id: user._id,
         name: user.name,
         email: user.email
      },
      token
   }
};

module.exports = {
   registerUser,
   loginUser
};