'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  author: String,
  owner: String,
  content: String,
  likes: [String],
  coments: [{
    author: String,
    message: String,
    createdAt: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: Date,

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;