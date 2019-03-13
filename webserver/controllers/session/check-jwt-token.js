'use strict';

const jwt = require('jsonwebtoken');

async function checkJwtToken(req, res, next) {
  /**
   * Validar que el authorization token sea valido
   * El header authorization tiene el formato
   *  JWT aqui_el_jwt_token_value
   */
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send();
  }

  // .startsWith('JWT ');
  const [prefix, token] = authorization.split(' '); // [JWT, quwrioquwoerquweroqweu]
  if (prefix !== 'JWT') {
    return res.status(401).send();
  }

  if (!token) {
    return res.status(401).send();
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_JWT_SECRET);

    if (!decoded) {
      return res.status(401).send();
    }

    req.claims = {
      uuid: decoded.uuid,
      role: decoded.role,
    };

    return next();
  } catch (e) {
    return res.status(401).send();
  }
}

module.exports = checkJwtToken;
