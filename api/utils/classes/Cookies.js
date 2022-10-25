module.exports = class Cookies {
  constructor() {
    this.cookieOpt = {
      httpOnly: true,
      maxAge : 90 * 24 * 60 * 60 * 1000,
      // expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production" ? true : false,
    };
  }

  sendCookie(res, key, value) {
    res.cookie(key, value, this.cookieOpt);
  }

  static getCookie(req, key) {
    return req.cookies[key];
  }
};
