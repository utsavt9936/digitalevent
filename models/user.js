const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  socketId: {
    type: String
  },
  conversations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Conversation'
  },
  rooms: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Room'
  },
  otp: {
    type: Number
  },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Post'
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Post'
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment'
  }
});

const User = mongoose.model('User' , userSchema);

function validateUser(user) {
  const Schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email().insensitive(),
    password: Joi.string().min(5).max(255).required(),
    socketId: Joi.string()
  }

  return Joi.validate(user , Schema);
}

exports.User = User;
exports.validateUser = validateUser;