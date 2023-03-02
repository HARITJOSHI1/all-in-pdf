const Cookies = require("./classes/Cookies");
exports.addDocInfoCookie = (res, doc) =>
  new Cookies().sendCookie(res, "docData", [{ name: doc }]);