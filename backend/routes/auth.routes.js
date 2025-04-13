import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import {User} from "../models/test.js";  // Ensure the correct file path
import dotenv from "dotenv";
import Patient from "../models/patient.js";
import Employee from "../models/employee.js";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1m" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: "10m" });
    console.log(refreshToken);
    return { accessToken, refreshToken };
};



// Login
router.post("/login", async (req, res) => {
  const { email, password ,userType} = req.body;
  try {
    let user;
    
    if(userType=="patient"){
      user = await Patient.findOne({ email });
    }
    else{
      user = await Employee.findOne({ email });
    }
    

    // const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });

    if(userType=="patient")res.json({ accessToken, role: "patient" });
    else res.json({ accessToken, role: user.role });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Refresh Token
router.post("/refresh", (req, res) => {
    console.log("halwa")
    console.log(req.cookies)
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: "10m" });
    res.json({ accessToken });
  } catch (err) {
    console.log("apple")
    res.status(403).json({ error: "Invalid refresh token" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

export default router;
