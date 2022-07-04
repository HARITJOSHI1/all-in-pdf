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

  const id = await ifTempInitUser(
    Cookies.getCookie(req, "sessionId")
  );

  req.session.userId = id;

  new Cookies().sendCookie(res, "sessionId", id);
  DocSaver.initDoc(req.session.userId);
  // await client.set(_id, true);
  next();
};
