const { Readable, Transform } = require("stream");
const catchAsync = require("../utils/catchAsync");
const OCR = require("../utils/classes/OCR");
const Response = require("../utils/Response");
const TextExtract = require("../utils/classes/TextExtract");
const {findTheLang} = require("../utils/languageDetector");

exports.langDetect = catchAsync(async (req, res, next) => {
  const extractorObj = await TextExtract.setup(req.files[0].buffer, 1);
  const lang = await findTheLang(extractorObj.result.text);
  new Response(res, 200, "Language detected successfully", undefined, {
    file: req.files[0].originalname,
    mimetype: 'application/pdf',
    detection: lang
  });
});

exports.textExtract = catchAsync(async (req, res, next) => {
  console.log("Text Extraction started...");
  const pdf = req.files[0];
  const results = await OCR.start(pdf, req.lang);

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
