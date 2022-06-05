const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const createRefreshTokens = require("../utils/createRefreshToken");
const Cookie = require("../utils/classes/Cookies");

const verifyToken = (t, type) => {
  const secret = process.env.JWT_SECRET_R;
  let res;
  jwt.verify(t, secret, (err, decoded) => {
    if (err) res = false;
    else res = decoded;
  });
  return res;
};

const sendToken = (res, token) => {
  new Cookie().sendCookie(res, "jwt", token);

  res.status(200).json({
    status: "success",
    message: `Tokens refreshed`,
    token
  });
};


exports.refresh = (req, res) => {
  const refreshToken = req.cookies.jwt.refreshToken;
  const r = verifyToken(refreshToken, "r");

  if (r) {
    const token = createRefreshTokens(r._id, "access");
    sendToken(res, token);
  } 
  
  else {
    const token = createRefreshTokens(r._id);
    sendToken(res, token);
  }
}
