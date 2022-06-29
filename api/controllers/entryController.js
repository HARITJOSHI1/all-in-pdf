const Users = require("../models/Users");
const catchAsync = require("../utils/catchAsync");
const createRefreshToken = require("../utils/createRefreshToken");
const { VerificationEmail } = require("../utils/classes/HandleEmail");
const Cookies = require("../utils/classes/Cookies");
const AppError = require("../utils/classes/AppError");

async function checkUserExists(Model, req) {
  await Model.findByIdAndDelete(Cookies.getCookie(req, "sessionId"));
  if (await Model.findOne({ email: req.body.email })) return true;
  return false;
}

const filter = (user) => {
  const fields = [
    "verifyEmail",
    "verifyEmailExp",
    "password",
    "phoneNo"
  ];

  fields.forEach((p) => {
    user[p] = undefined;
  });

  return user;
}

exports.signUp = catchAsync(async (req, res) => {
  if (await checkUserExists(Users, req)) {
    throw new AppError(409, `User with ${req.body.email} already exists`, `fn signUp(), ${__dirname}`);
  }

  const newUser = await Users.create(req.body);
  await new VerificationEmail(newUser, req).send(req.body.email);

  const user = { ...newUser._doc };
  const token = createRefreshToken(newUser._id);

  if (token) {
    new Cookies().sendCookie(res, "jwt", token);
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

  if (!email || !password)
    throw new AppError(401, `User doesn't exist`, `fn login(), ${__dirname}`);

  // 2. check whether user exist or signed up
  const user = await Users.findOne({ email }).select("+password");
  // console.log(await user.correctPassword(password, user.password));

  if (!user || !await user.correctPassword(password, user.password)){
    throw new AppError(401, 'Incorrect email or password', `fn login(), ${__dirname}`);}

  // 3. create token
  const token = createRefreshToken(user._id);
  new Cookies().sendCookie(res, "jwt", token);

  // 4. Send response
  res.status(200).json({
    status: "loggedIn",
    token,
  });
});


exports.logOut = catchAsync(async (req, res) => {
    new Cookies().sendCookie(res, 'jwt', "");
    res.status(200).json({
      status: "success",
      message: "Logged out"
    });
});