const fs = require("fs");
const { parse } = require("csv-parse");

const _parse = (lang, csvDataPath) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvDataPath)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", ([code, lng]) => {
        if (lang === lng) resolve(code);
      });
  });
};

exports.parserCSV = async (lang, csvDataPath) => {
  return await _parse(lang, csvDataPath);
};
