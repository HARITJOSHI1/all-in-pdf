const catchAsync = require('../utils/catchAsync');
const Cookies = require('../utils/classes/Cookies');
const Response = require('../utils/Response');
const Subscriptions = require('../models/Subscriptions');

exports.isStillActive = catchAsync(async (req, res, next) => {
  const r_payload = Cookies.getCookie(req, 'recurring_start');
  const { timeUp } = req.body;
  if (r_payload) {
    const date = r_payload.split('.')[0];

    date > timeUp
      ? new Response(res, 200, 'active', 'subscription month active')
      : next();
  } else {
    const sub = await Subscriptions.findOne({
      userId: req.userId,
      reccur: { $lt: timeUp },
    });
    sub
      ? new Response(res, 200, 'active', 'subscription month active')
      : next();
  }
});

exports.create = catchAsync(async (req, res, next) => {
  req.body.userId = req.userId;
  await Subscriptions.create(req.body);
  new Response(res, 200, 'success', 'subscription added');
});