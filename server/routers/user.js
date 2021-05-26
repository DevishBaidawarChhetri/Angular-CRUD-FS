const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");

const router = express.Router();

/**
 * @route POST /api/user
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
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(422).json({
        message: "Email already exist!",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashPassword });
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

module.exports = router;
