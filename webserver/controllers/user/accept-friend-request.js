'use strict';

const Joi = require('joi');
const UserModel = require('../../../models/user-model');

async function validate(payload) {
  const schema = {
    uuid: Joi.string().guid({
      version: ['uuidv4'],
    }),
  };

  return Joi.validate(payload, schema);
}

async function  addConfirmedFriend(friend, me) {
  /**
   * Yo, Miguel, acepto a Jose como amigo entonceS:
   *  - Miguel en us listado de amigos tiene a jose con confrimedAt: now
   *  - Falta poner a MIGUEL (me) en el listado de amigos de jose (friend uuid)
   */
  const filter = {
    uuid: friend,
  };

  const now = Date.now();

  const op = {
    $push: {
      friends: {
        uuid: me,
        confirmedAt: now,
        createdAt: now,
        rejectedAt: null,
      },
    },
  };

  await UserModel.findOneAndUpdate(filter, op);
  
  // edge case, eliminar peticiones anteriores SI se hicieron la request y nadie confirmó
  const deleteOp = {
    $pull: {
      friends: {
        uuid: me,
        confirmedAt: null,
      },
    },
  };

  await UserModel.findOneAndUpdate(filter, deleteOp);
}

async function acceptFriendRequest(req, res, next) {
  // destructuring
  const { uuid: friendUuid } = req.body;
  const { uuid: me } = req.claims;

  try {
    await validate({ uuid: friendUuid });
  } catch (e) {
    return res.status(400).send(e);
  }

  /**
   * tengo que buscar en mi usuario y mi array de friends, el amigo que me hizo la peticion,
   * si se encuentra entonces actualizar el field confirmedAt
   */
  const filter = {
    uuid: me,
    'friends.uuid': friendUuid,
    'friends.confirmedAt': null,
  };

  const op = {
    $set: {
      'friends.$.confirmedAt': Date.now(),
    },
  };

  try {
    await UserModel.findOneAndUpdate(filter, op, { rawResult: true });
    /**
     * Yo, Miguel, acepto a Jose como amigo entonceS:
     *  - Miguel en us listado de amigos tiene a jose con confrimedAt: now
     *  - Falta poner a MIGUEL (me) en el listado de amigos de jose (friend uuid)
     */
    await addConfirmedFriend(friendUuid, me);
  } catch (e) {
    return res.status(500).send(e.message);
  }

  return res.send();
}

module.exports = acceptFriendRequest;
