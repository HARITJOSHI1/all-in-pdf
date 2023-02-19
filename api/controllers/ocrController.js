const catchAsync = require("../utils/catchAsync");
const TextExtractor = require("../utils/classes/TextExtractor");

exports.textExtract = catchAsync(async (req, res) => {
  console.log("Text Extraction started...");  
  const pdf = req.files[0];
  const results = await TextExtractor.extract(pdf);

  if (!results)
    throw new AppError(
      500,
      "Failed to compress",
      ` fn textExtract(),  ${__dirname}`
    );

  else console.log("here are the results: ", results);
  res.send();
});
