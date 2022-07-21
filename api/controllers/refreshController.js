
const jwt = require('jsonwebtoken');
const createRefreshTokens = require('../utils/createRefreshToken');
const Cookie = require('../utils/classes/Cookies');
const AppError = require("../utils/classes/AppError");

const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
jwt.verify = promisify(jwt.verify);

const verifyToken = async (t, type) => {
  const secret = process.env.JWT_SECRET_R;
  const data = await jwt.verify(t, secret);
  return data;
};

const sendToken = (res, token) => {
  res.cookie('jwt', token);
  res.status(200).json({
    status: 'success',
    message: `Token refreshed`,
    token,
  });
};

exports.refresh = catchAsync(async (req, res) => {
  if (!req.cookies?.jwt) {
    throw new AppError(
      401,
      'JWT not provided',
      `fn refresh(), ${__filename}`,
      'JWT'
    );
  } else {
    const refreshToken = req.cookies.jwt.refreshToken;
    const r = await verifyToken(refreshToken, 'r');

    if (r) {
      const token = createRefreshTokens(r._id, 'access');
      token.refreshToken = refreshToken;
      sendToken(res, token);
    } else {
      const token = createRefreshTokens(r._id);
      sendToken(res, token);
    }
  }
});
