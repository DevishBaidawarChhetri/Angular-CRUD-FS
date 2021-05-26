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
  const { fullName, email, password } = req.body;

  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(422).json({
      message: "Email already exist!",
    });
  }

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({ fullName, email, password: hash });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Signup Successful!",
          result,
        });
      })
      .catch((err) => {
        res.status(422).json({
          message: "Invalid authentication credentials.",
        });
      });
  });
});

module.exports = router;
