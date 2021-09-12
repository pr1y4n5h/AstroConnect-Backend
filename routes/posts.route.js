const express = require('express');
const router = express.Router();
const Post = require("../models/post.model.js");
const User = require("../models/user.model.js");
const { authenticateUser } = require("../middleware/authenticate");

router.use(authenticateUser);

//Create Post
router.route('/')
.post(async (req,res) => {
  const data = req.body;
  try {
  const newPost = await new Post(data);
  const savedPost = await newPost.save();
  res.status(200).json(savedPost)
  }
  catch(error) {
    res.status(500).json(error)
  }
})

//Update a Post
router.route('/:id')
.post(async (req,res) => {
  const {id} = req.params;
  const {userId} = req.body
  try{
    const post = await Post.findById(id);
    if(post.userId === userId){
      await post.updateOne({$set: req.body});
      res.status(200).json("Post has been updated")
    }
    else{
    res.status(403).json("You can update only your post")  
    }
  }
  catch(error){
    res.status(500).json(error)
  }
})

//Delete a Post
router.route('/')
.delete(async (req,res) => {
  const {userId, postId} = req.body
  try{
    const post = await Post.findById(postId);
    if(post.userId === userId){
      await post.deleteOne({_id: postId});
      res.status(200).json("Post has been deleted")
    }
    else{
    res.status(403).json("You can delete only your post")  
    }
  }
  catch(error){
    res.status(500).json(error)
  }
})

//Like dislike post
router.route('/:id/like')
.post(async (req, res) => {
  const {id} = req.params;
  const {userId, type} = req.body
  try {
  const post = await Post.findById(id);
  if(type === "REMOVE"){
    await post.updateOne({$pull: {likes: userId}})
  }
  else {
    await post.updateOne({$push: {likes: userId}})
  }
  res.status(200).json("Post has been Liked/unliked");

  }
  catch(error){
    res.status(500).json(error)
  }
})

//Get a Post
router.route('/:id')
.get(async (req, res) => {
  const {id} = req.params;
  try{
    const post = await Post.findById(id);
    res.status(200).json(post)
  }
   catch(error){
    res.status(500).json(error)
  }
})

//Fetch Timeline Post
router.route('/timeline/:userId')
.get(async (req, res) => {
  const {userId} = req.params;
  try{
    const currentUser = await User.findById(userId);
    const userPosts = await Post.find({userId: currentUser._id})

    const friendPosts = await Promise.all(
      currentUser.followings.map(friendID => {
        return Post.find({userId: friendID})
      })
    )
    res.status(200).json(userPosts.concat(...friendPosts))
  }
   catch(error){
    res.status(500).json(error)
  }
})

//Fetch User's all Post
router.route('/profile/:user')
.get(async (req, res) => {
  const {user} = req.params;
  try{
    // const user = await User.findOne({username: user})
    const posts = await Post.find({userId: user})

    res.status(200).json(posts)
  }
   catch(error){
    res.status(500).json(error)
  }
})


module.exports = router