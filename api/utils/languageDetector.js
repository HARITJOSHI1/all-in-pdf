const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

let key = "f494952b5940449db5028ce5c8056d99";
let endpoint = "https://api.cognitive.microsofttranslator.com";
let location = "global";

exports.findTheLang = (src) => {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios({
      baseURL: endpoint,
      url: "/detect",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": "3.0",
      },
      data: [
        {
          text: src,
        },
      ],
      responseType: "json",
    });

    if (!data) reject();
    resolve(data);
  });
};