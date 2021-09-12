const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require("bcryptjs");


const { authenticateUser } = require("../middleware/authenticate");

router.use(authenticateUser);

//Update user details
router.route('/:id')
.post( async (req, res) => {
  const {userId, password} = req.body;
  const {id} = req.params;
  if(userId === id) {
    try {
      const user = await User.findByIdAndUpdate(id, {
        $set: req.body
      })
      res.status(200).json({message: "Account has been updated", success: true})
    }
    catch(error) {
      return res.status(500).json(error)
    }
  }
  else {
    return res.status(401).json("Update only your account")
  }
})

//Get User
router.route('/:id')
.get(async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findById(id);
    const {password, updatedAt, ...userData} = user._doc
    res.status(200).json(userData)
  }
  catch(error){
    res.status(500).json(error)
  }
})

//Get Followings
router.route("/followings/:id")
.get(async (req, res) => {
  const {id} = req.params
  try{
    const user = await User.findById(id)
    const friends = await Promise.all(
      user.followings.map(friendID => (
        User.findById(friendID)
      ))
    )

    let friendList = [];
    friends.map(item => {
      const {_id, username} = item;
      friendList.push({_id, username});
    })
    res.status(200).json(friendList)
  }
  catch(error){
    console.log(error)
  }
})

//Fetch all people
router.route('/:id/allusers')
.get(async (req, res) => {
  const {id} = req.params
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers)
  }
  catch(error){
    res.status(500).json(error)
  }
})

//Follow a user
router.route('/:id/follow')
.post(async (req,res) => {
  const {userId} = req.body;
  const {id} = req.params;

  if(id !== userId){
    try{
      const user = await User.findById(id); //other user
      const currUser = await User.findById(userId); //logged user
      if(!user.followers.includes(userId)){
        await user.updateOne({$push: {followers: userId}})
        await currUser.updateOne({$push: {followings: id}})
        res.status(200).json("You started following this user")
      }
      else {
        res.status(403).json("You are already following this user")
      }
    }
    catch(error){
      res.status(500).json(error)
    }
  }
  else{
    res.status(403).json("You can't follow yourself")
  }
})


//Unfollow a user
router.route('/:id/unfollow')
.post(async (req,res) => {
  const {userId} = req.body;
  const {id} = req.params;

  if(id !== userId){
    try{
      const user = await User.findById(id); //other user
      const currUser = await User.findById(userId); //logged user
      if(user.followers.includes(userId)){
        await user.updateOne({$pull: {followers: userId}})
        await currUser.updateOne({$pull: {followings: id}})
        res.status(200).json("You unfollowed this user")
      }
      else {
        res.status(403).json("You have already unfollowed this user")
      }
      }
    catch(error){
      res.status(500).json(error)
    }
  }
  else{
    res.status(403).json("You can't unfollow yourself")
  }
})

module.exports = router