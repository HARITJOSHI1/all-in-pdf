const jwt = require("jsonwebtoken");

const createJWT = (_id, type) => {
  return jwt.sign(
    { _id },
    type === "access" ? process.env.JWT_SECRET_A : process.env.JWT_SECRET_R,
    {
      expiresIn:
        type === "access"
          ? process.env.JWT_EXPIRES_A
          : process.env.JWT_EXPIRES_R,
    }
  );
};

module.exports = function createRefreshTokens(_id, type = null) {
  let token = null;
  switch (type) {
    case "access":
      token = {
        accessToken: createJWT(_id, "access"),
      };
      break;

    default:
      token = {
        refreshToken: createJWT(_id, "refresh"),
        accessToken: createJWT(_id, "access"),
      };
  }
  return token;
};
