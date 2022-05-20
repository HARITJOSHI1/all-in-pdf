const Users = require("../models/Users");
const catchAsync = require("../utils/catchAsync");
const createRefreshToken = require("../utils/createRefreshToken");
const { VerificationEmail } = require("../utils/classes/HandleEmail");
const Cookies = require("../utils/classes/Cookies");

async function checkUserExists(Model, req) {
  if (await Model.findOne({ email: req.body.email })) return true;
  return false;
}

const filter = (user) => {
  const fields = [
    "verifyEmail",
    "verifyEmailExp",
    "password",
    "instituteAccess",
    "instituteAccessExp",
    "districtAdminAccess",
    "districtAdminAccessExp",
  ];

  fields.forEach((p) => {
    user[p] = undefined;
  });

  return user;
}

exports.signUp = catchAsync(async (req, res) => {
  if (await checkUserExists(Users, req)) {
    res.status(409).json({
      status: "conflicting",
      message: `User with ${req.body.email} already exists`,
    });
    return;
  }

  const newUser = await Users.create(req.body);
  await new VerificationEmail(newUser, req).send(req.body.email);

  const user = { ...newUser._doc };
  const token = createRefreshToken(newUser._id);
  if (token) {
    new Cookies().sendCookie(res, "refreshToken", token.refreshToken);
    new Cookies().sendCookie(res, "accessToken", token.accessToken);
  }

  // email TODO

  res.status(201).json({
    status: "signedUp",
    token,
    data: {
      user: filter(user),
    },
  });
});


exports.login = catchAsync(async (req, res, next) => {
  // 1. check whether email and password are provided by the user or not
  const { email, password } = req.body;

  if (!email || !password) {
    // return next(new AppError('Please enter your email or password', 401));
  }

  // 2. check whether user exist or signed up
  const user = await Users.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    // return next(new AppError('Incorrect email or password', 401));
  }

  // 3. create token
  const token = createRefreshToken(user._id);
  new Cookies().sendCookie(res, "jwt", token);

  // 4. Send response
  res.status(200).json({
    status: "loggedIn",
    token,
  });
});


exports.logOut = catchAsync((req, res, next) => {
  if(Cookies.getCookie(req, 'refreshToken') && Cookies.getCookie(req, 'accessToken')){
    new Cookies().sendCookie(res, 'jwt', "");
    res.status(404).json({
      status: "success",
      message: "Logged out"
    });
  }

  else{
    res.status(404).json({
      status: "failed",
      message: "Cookie doesn't exist or expired"
    });
  }

  return;
});