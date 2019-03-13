'use strict';

const Joi = require('joi');
const PostModel = require('../../../models/post-model')


async function validate(payload) {

  const schema = {
    content: Joi.string().min(2).max(500).required(),
  };

  return Joi.validate(payload, schema);
}

async function createPost(req, res, next) {
  const dataPost = { ...req.body };
  const { claims } = req;
  /**
   * 1. validator datos
   */
  try {
    await validate(dataPost);
  } catch (e) {
    return res.status(400).send(e);
  }

  /**
   * 2. Insertar los datos en mongo (actualizar los datos del usuario en mongo)
   */

  try {
    const postToCreate = {
      author: claims.uuid,
      owner: claims.uuid,
      content: dataPost,
      createdAt: Date.now,
      coments: [],
      likes: [],
      deletedAt: null,

    };
    const data = await PostModel.create(postToCreate);
    console.log('mongoose data', data);
    return res.status(204).send();

  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = createPost;
