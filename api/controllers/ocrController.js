const catchAsync = require("../utils/catchAsync");
const TextExtractor = require("../utils/classes/TextExtractor");
const Response = require("../utils/Response");

exports.textExtract = catchAsync(async (req, res, next) => {
  console.log("Text Extraction started...");
  const pdf = req.files[0];
  const results = await TextExtractor.extract(pdf);

  if (!results)
    throw new AppError(
      500,
      "Failed to compress",
      ` fn textExtract(),  ${__dirname}`
    );

  console.log(results);  
  req.filename = results.fileName;
  req.msg = "OCR applied on the pdf";
  req.document = results;    
  next();
});
