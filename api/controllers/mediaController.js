const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/classes/Emails");
const AppError = require("../utils/classes/AppError");
const Response = require("../utils/Response");

exports.shareMediaByEmail = catchAsync(async (req, res, next) => {
  const {docData} = req;
  // const doc = await Document.findById(docId);

  if (!docData.length)
    throw new AppError(500, "Something went wrong", `fn sendMediaByEmail(), ${__dirname}`);

  await new Email({
    from: req.from,
    to: req.to,
    message: req.message ? req.message : "Documents shared using superpdf.com",
  }).sendResponseEmail(docData);

  new Response(res, 200, "success",  "document shared succesfully");
});
