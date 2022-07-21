const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/classes/AppError');
const Users = require('../models/Users');
const Cookies = require('../utils/classes/Cookies');
const crypto = require('crypto');
const HasAccount = require('../utils/HasAccount');
const { promisify } = require('util');

class AuthUser {
  access = [['verifyEmail', 'verifyEmailExp']];

  find(str, mainStr) {
    let isMatch = false;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === mainStr[i]) isMatch = true;
      else break;
    }
    return isMatch;
  }

  select(acc) {
    const temp = [];
    this.access.forEach((p, idx) => {
      if (this.find(acc, p[0])) {
        temp.push(this.access[idx]);
      }
    });

    return [...temp[0]];
  }

  async findDoc(acc, h_token) {
    const arr = this.select(acc);
    return await Users.findOne({
      [arr[0]]: h_token,
      [arr[1]]: { $gt: Date.now() },
    });
  }

  async getVerifiedUser(task, v_token) {
    const h_token = crypto.createHash('sha256').update(v_token).digest('hex');
    return await this.findDoc(task, h_token);
  }
}

class AuthViaEmail extends AuthUser {
  constructor(res, message, token) {
    super();
    this.res = res;
    this.token = token;
    this.message = message;
  }

  isUser(user) {
    if (user) return true;
    else return false;
  }

  async saveChanges(acc, id, status) {
    const arr = this.select(acc);
    return await Users.findByIdAndUpdate(
      id,
      {
        [arr[0]]: status,
        [arr[1]]: undefined,
      },
      { new: true }
    );
  }

  async send(account = 'verify', status = 'verified') {
    const user = await this.getVerifiedUser(account, this.token);

    if (!this.isUser(user)) {
      this.res.status(401).json({
        status: 'failed',
        message: 'Cannot verified',
      });

      return;
    }

    await this.saveChanges(account, user._id, status);
    this.res.status(200).json({
      status: 'success',
      email: user.email,
      message: this.message,
    });
  }
}

exports.authenticateViaEmail = catchAsync(async (req, res) => {
  const path = req.path;
  const token = req.params.id;

  if (path.search('verify') !== -1) {
    const message = 'Email is verified';
    await new AuthViaEmail(res, message, token).send();
  }
});

jwt.verify = promisify(jwt.verify);

exports.verifyJWT = catchAsync(async (req, res, next) => {
  const secret = process.env.JWT_SECRET_A;

  if (!req.cookies?.jwt)
    throw new AppError(
      401,
      'JWT not provided',
      `fn verifyJWT(), ${__filename}`,
      'JWT'
    );
  else {
    const data = await jwt.verify(req.cookies.jwt.accessToken, secret);

    if (!data)
      throw new AppError(
        500,
        'Failed to verify the token',
        `fn verifyJWT(), ${__dirname}`,
        'JWT'
      );
    else {
      req.userId = data._id;
      next();
    }
  }
});

exports.isAvalToShare = catchAsync(async (req, res, next) => {
  const { from, to, message } = req.body;
  if (!(await HasAccount(from)))
    throw new AppError(404, 'User not found', `fn HasAccount(), ${__dirname}`);

  req.from = from;
  req.to = to;
  req.message = message;
  req.docData = Cookies.getCookie(req, 'docData');

  next();
});
