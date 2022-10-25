const catchAsync = require('../utils/catchAsync');
const Cookies = require('../utils/classes/Cookies');
const Subscriptions = require('../models/Subscriptions');

// const stripe = require('stripe')(
//   process.env.NODE_ENV === 'development'
//     ? process.env.STRIPE_SK_TEST
//     : process.env.STRIPE_SK_PROD
// );

const stripe = require('stripe')(
  'sk_test_51LJxnCSDlhCRlZPc5zphnuPGomyWSPS76cZDbhIf3WFzX4YjI5IdItlSo8lrstGMBxWsGNAb07JoocSSRioR0cos00l0LCd3tB'
);
const Response = require('../utils/Response');
const AppError = require('../utils/classes/AppError');

const _subscribe = async (req, next) => {
  const { payment_method, email } = req.body;
  const { paymentMethod } = payment_method;
  const customer = await stripe.customers.create({
    payment_method: paymentMethod.id,
    email,
    address: paymentMethod.billing_details.address,
    description: `User ${req.userId} subscribed for trial`,
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price: 'price_1LO1TJSDlhCRlZPcKQlro1aY',
      },
    ],
    default_payment_method: paymentMethod.id, 
    expand: ['latest_invoice.payment_intent'],
  });

  const status = subscription['latest_invoice']['payment_intent']['status'];
  const client_secret =
    subscription['latest_invoice']['payment_intent']['client_secret'];

  return { client_secret, status, st: customer.created, cid: customer.id };
};

exports.subscribe = catchAsync(async (req, res, next) => {
  const { method, mode } = req.query;
  // const trialEnd = Math.floor((Date.now() / 1000 * 60 * 60 * 24 * 7) / 1000);

  if (method === 'subscription' && mode === 'trial') {
    const data = await _subscribe(req, next);
    const date = new Date(data.st);
    const nextMonth = +new Date(date.getFullYear(), date.getMonth() + 1, 1);

    if (data) {
      new Cookies().sendCookie(
        res,
        'recurring_start',
        `${nextMonth}.${req.userId}`
      );

      new Response(res, 200, data.status, undefined, {
        status: data.status,
        client_secret: data.client_secret,
        customerId: data.cid,
        createdAt: data.st,
        reccur: nextMonth
      });
    }
  } else _subscribe(req, next);
});


exports.cancel = catchAsync(async (req, res, next) => {
  const { subId } = req.body;
  const delData = await stripe.subscriptions.del(subId);

  if (delData) {
    await Subscriptions.deleteOne({userId: req.userId});
    new Response(res, 200, 'success', 'subscription canceled');
  }
  else throw new AppError(500, "An error occured while cancelling. Please try again later", null);
});
