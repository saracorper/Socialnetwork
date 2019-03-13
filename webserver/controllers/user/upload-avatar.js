'use strict';

const cloudinary = require('cloudinary');
const UserModel = require('../../../models/user-model');

const cloudName = process.env.CLOUDINARI_CLOUD_NAME;
const apiKey = process.env.CLOUDINARI_API_KEY;
const apiSecret = process.env.CLOUDINARI_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

async function uploadAvatar(req, res, next) {
  const { uuid } = req.claims;
  const { file } = req;

  if (!file.buffer) {
    return res.status(400).send();
  }
  
  // necesito la imagen que suben desde postman/ browser / whatever

  // subir foto a cloudinary
  cloudinary.v2.uploader.upload_stream({
    resource_type: 'raw',
    public_id: uuid,
    width: 200,
    height: 200,
    format: 'jpg',
    crop: 'limit',
  }, async(err, result) => {
    if (err) {
      console.error('hubo error', err);
      return res.status(400).send(err);
    }

    const {
      etag,
      secure_url: secureUrl,
    } = result;

    // actualizar perfil de usuario con la foto de cloudinary
    const updateUserProfile = {
      avatarUrl: secureUrl,
    };

    try {
      await UserModel.updateOne({ uuid }, updateUserProfile);

      // devolve el 204 y el header location con la url de la foto
      res.header('Location', secureUrl);
      return res.status(204).send();
    } catch (e) {
      console.log(e);
      return res.status(500).send(err.mesage);
    }

    // console.log(result);
  }).end(file.buffer);
}

module.exports = uploadAvatar;
