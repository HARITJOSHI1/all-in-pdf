const { Readable, Transform } = require("stream");
const catchAsync = require("../utils/catchAsync");
const OCR = require("../utils/classes/OCR");
const Response = require("../utils/Response");
const TextExtract = require("../utils/classes/TextExtract");
const { findTheLang, translateTheDoc } = require("../utils/languageDetector");
const { addDocInfoCookie } = require("../utils/addDocToCookie");

exports.langDetect = catchAsync(async (req, res) => {
  const extractorObj = await TextExtract.setup(req.files[0].buffer, 1);
  const lang = await findTheLang(extractorObj.result.text);
  new Response(res, 200, "Language detected successfully", undefined, {
    file: req.files[0].originalname,
    mimetype: "application/pdf",
    detection: lang,
  });
});

exports.translateDoc = catchAsync(async (req, res) => {
  const extractorObj = await TextExtract.setup(req.files[0].buffer);
  const { to, from } = req.query;
  const output = await translateTheDoc(from, extractorObj.result.text, to);
  
  new Response(res, 200, "Translation successfull", undefined, {
    file: req.files[0].originalname,
    mimetype: "application/pdf",
    output,
  });
});

exports.ocr = catchAsync(async (req, res, next) => {
  if (req.query["lang"] === undefined)
    throw new AppError(
      400,
      "Pass valid query parameter like lang",
      ` fn textExtract(),  ${__dirname}`
    );

  const fixLang = (query) => {
    return query
      .toLowerCase()
      .split("")
      .map((e, idx) => {
        if (idx === 0) return e.toUpperCase();
        else return e;
      })
      .join("");
  };

  console.log("Text Extraction started...");
  const pdf = req.files[0];
  const language = fixLang(req.query.lang);

  const results = await OCR.start(pdf, language);
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
  addDocInfoCookie(res, results.fileName);
  next();
});
