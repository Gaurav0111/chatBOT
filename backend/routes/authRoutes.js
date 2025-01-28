const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

require("dotenv").config();
const router = express.Router();

// Temporary storage for verification codes
const verificationCodes = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Send verification code
router.post("/send-verification", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send("Email is required");

  const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
  verificationCodes[email] = verificationCode;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Error sending email.");
    }
    res.status(200).send("Verification code sent successfully.");
  });
});

// Verify code and register user
router.post("/register", async (req, res) => {
  const { name, email, password, verificationCode } = req.body;

  if (!name || !email || !password || !verificationCode) {
    return res.status(400).send("All fields are required");
  }

  // Verify the code
  if (!verificationCodes[email] || verificationCodes[email] != verificationCode) {
    return res.status(400).send("Invalid or expired verification code.");
  }

  // Hash password and save user
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();
    delete verificationCodes[email];

    res.status(201).send("User registered successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user.");
  }
});

module.exports = router;
