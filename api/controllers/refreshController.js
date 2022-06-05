const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const createRefreshTokens = require("../utils/createRefreshToken");

const verifyToken = (t, type) => {
  const secret =
    type === "a" ? process.env.JWT_SECRET_A : process.env.JWT_SECRET_R;
  let res;
  jwt.verify(t, secret, (err, decoded) => {
    if (err) res = false;
    else res = decoded;
  });
  return res;
};

exports.verifyJwtToken = (t, type) => {
  return verifyToken;
};

const sendToken = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, setCookieOptions());
  res.cookie("refreshToken", refreshToken, setCookieOptions());

  res.status(200).json({
    status: "success",
    message: `Refresh token generated`,
  });
};

const setCookieOptions = () => {
  return {
    httpOnly: true,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production" ? true : false,
  };
};

exports.refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.accessToken;
  const r = verifyToken(refreshToken, "r");

  if (r && !verifyToken(accessToken, "a")) {
    const token = createRefreshTokens(r._id, "access");
    sendToken(res, token.accessToken, refreshToken);
  } 
  
  else {
    const token = createRefreshTokens(r._id);
    sendToken(res, token.accessToken, token.refreshToken);
  }
  
//   else {
//     res.status(400).json({
//       status: "expired",
//       message: `Refresh token expired`,
//     });
//   }
}
