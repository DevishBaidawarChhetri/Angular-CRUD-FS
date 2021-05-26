const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserProvider = require("../models/userSchema");

const router = express.Router();

/**
 * @route POST /api/user/signup
 * @desc User Signup
 * @access Public
 */

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(422).json({
        message: "Don't leave fields empty!",
      });
    }
    const userExist = await UserProvider.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(422).json({
        message: "Email already exist!",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new UserProvider({ fullName, email, password: hashPassword });
    await user.save();
    res.status(201).json({
      message: "Signup Successful!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error!",
    });
  }
});

/**
 * @route POST /api/user/login
 * @desc User Login
 * @access Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserProvider.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials!",
      });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({
        message: "Invalid Credentials!",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: `Welcome, ${user.fullName}`,
      token,
      expiresIn: 3600,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

module.exports = router;
