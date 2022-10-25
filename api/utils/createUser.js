const Users = require("../models/Users");
const DocSaver = require("../utils/classes/DocSaver");
const Cookies = require("./classes/Cookies");
// const {client} = require("./initRedis");

// const { promisify } = require("util");
// client.get = promisify(client.get);

const ifTempInitUser = async (sessionId) => {
  let doc;
  const data = await Users.findById(sessionId);
  if (data && sessionId) doc = data;
  else doc = await Users.create({});

  return doc.id;
};

exports.createUser = async (req, res, next) => {
  // const userId = await client.get(req.session.userId);

  // if(userId){
  //     console.log("user exists", userId);
  //     res.end();
  //     return;
  // }
  
  let id = null;
  if (!req.userId) {
    id = await ifTempInitUser(Cookies.getCookie(req, "sessionId"));
    // await client.set("userId", id);
    req.session.userId = id;
    new Cookies().sendCookie(res, "sessionId", id);
  }

  id = id ? id : req.userId;
  DocSaver.initDoc(id);
  next();
};
