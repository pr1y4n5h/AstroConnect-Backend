const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

//Register User
router.route('/register')
.post(async (req, res) => {
  const {username, email, password} = req.body;

  if(!username || !email || !password) {
    return res.status(409).json({success: false, message: "Please fill all the entries!"})
  }
  try {
    const emailExists = await User.findOne({ email: email });

    if(emailExists) {
      return res.status(422).json({message: "Email already exists!"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({username, email, password:hashedPassword});
    const user = await newUser.save();
    res.status(200).json({user, success: true, message: "User registered successfully!"})
  }
  catch(error) {
    console.log(error);
    res.status(500).json({message: "Error in registering user"})
  }
})

//Login User
router.route('/login')
.post(async (req,res) => {
  const { email, password } = req.body;

  if (!email || !password) {
        return res.status(409).json({
          success: false,
          message: "Please fill complete credentials!",
        });
      }
  try {
    const user = await User.findOne({email: email})
    if(user) {
      const validPassword = await bcrypt.compare(password, user.password)
      if(validPassword) {
        const token = jwt.sign(
            { userId: user._id },
            process.env.API_SECRET,
            { expiresIn: "24h" }
          ); 
        res.status(200).json({message: "User login successfully!", user, token})
      }
      else {
          res.status(401).json({ success: false, message: "Invalid Credentials!" });
        }
    }
    else {
      res.status(401).json({ success: false,
          message: "Please check your credentials again!"})
    }
  }
  catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
})

module.exports = router