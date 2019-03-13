'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const wallSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  posts: [ObjectId],
});

const Wall = mongoose.model('Wall', wallSchema);

module.exports = Wall;

