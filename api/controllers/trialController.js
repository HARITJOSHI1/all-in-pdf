const catchAsync = require("../utils/catchAsync");
const Cookies = require("../utils/classes/Cookies");
const stripe = require("stripe")(process.env.STRIPE_SK);
const Response = require("../utils/Response");

const _subscribe = async (
  req,
  next,
  trialEnd = undefined,
  nextMonth = undefined
) => {
  const { payment_method, email } = req.body;
  const customer = await stripe.customer.create({
    payment_method,
    email,
    description: `User ${req.userId} subscribed for trial`,
  });

  const subscription = await stripe.subscription.create({
    customer: customer.id,
    items: [
      {
        price: "price_1LKNohSDlhCRlZPcGlrnffF8",
      },
    ],
    default_payment_method: payment_method,
    trial_end: trialEnd,
    billing_cycle_anchor: nextMonth,
    expand: ["latest_invoice.payment_intent"],
  });

  const status = subscription["latest_invoice"]["payment_intent"]["status"];
  const client_secret =
    subscription["latest_invoice"]["payment_intent"]["client_secret"];

  return { client_secret, status };
};

module.exports = catchAsync(async (req, res, next) => {
  const { method, mode } = req.query;
  const trialEnd = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const date = new Date();
  const nextMonth = +new Date(date.getFullYear(), date.getMonth() + 1, 1);

  if (method === "subscription" && mode === "trial") {
    const data = await _subscribe(req, next, trialEnd, nextMonth);
    new Response(res, 200, data.status, undefined, {
      status: data.status,
      client_secret: data.client_secret,
    });
  }
  else _subscribe(req, next);
});
