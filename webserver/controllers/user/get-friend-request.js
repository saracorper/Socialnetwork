'use strict';

const UserModel = require('../../../models/user-model');

async function getFriendRequests(req, res, next) {
  const { uuid } = req.claims;

  /**
   * buscamos los ids de mis amigos / posibles amigos
   */
  const filter = {
    uuid,
  };

  const projection = {
    friends: 1,
    _id: 0,
  };

  try {
    const friendsResult = await UserModel.findOne(filter, projection); // [{ ...user1 }, { ...user2 }, ...{user n}]
    const friendsUuids = friendsResult.friends.map(f => f.uuid); // [uuid1, uuid2, ..., uuid n]

    const filterFriendsData = {
      uuid: {
        $in: friendsUuids,
      },
      friends: {
        rejectedAt: null,
        confirmedAt: null,
      },
    };

    const projectionFriendsData = {
      uuid: 1,
      avatarUrl: 1,
      fullName: 1,
      _id: 0,
    };

    const users = await UserModel.find(filterFriendsData, projectionFriendsData).lean();
    return res.send({
      data: users,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getFriendRequests;
