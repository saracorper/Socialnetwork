'use strict';

const UserModel = require('../../../models/user-model');


async function getUserProfile(req, res, next) {
  const { claims } = req;
  try {
    const userData = await UserModel.findOne({ uuid: claims.uuid });
    return res.status(200).send(userData);
  } catch (error) {
    console.log(error);
  }
}

module.exports = getUserProfile;
