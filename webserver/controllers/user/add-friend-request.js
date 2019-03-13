'use strict';

const Joi = require('joi');
const UserModel = require('../../../models/user-model');

async function validate(payload) {
    const schema = {
        uuid: Joi.string().guid({
            version: [uuidv4],
        })
    };

    return Joi.validate(payload, schema);
}

async function addFriendRequest(req, res, next) {
    const friendData = { ...req.body };
    const { uuid } = req.claims;

    try {
        await validate(friendData);
    } catch (error) {
        res.status(400).send(error);
    }

    if (uuid == friendData.uuid) {
        return res.status(403).send();
    }

    const filter = {
        uuid: friendData.uuid,
    };

    const op = {
        $push: {
            friends: {
                uuid,
                createAt: Date.now(),
                confirmedAt: null,
                rejectedAt: null,
            },
        },
    };

    try {
        const result = UserModel.updateOne(filter, op);
        return res.status(204).send();

    } catch (e) {
        return res.status(500).send(e.message);
    }

    return res.status(201).send;
}




module.exports = addFriendRequest;
