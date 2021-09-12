const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
      required: "Username can't be void",
      unique: "Username already exists!",
      trim: true
  },

  email: {
      type: String,
      required: "Email can't be void!",
      unique: "Email ID already exists!",
      trim: true
  },

  password: {
    type: String,
    required: "Password can't be void"
  },

  followers: {
    type: Array,
    default: []
  },

  followings: {
    type: Array,
    default: []
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  bio: {
    type: String,
    max: 100
  }  
}, {
  timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;