const Users = require("../models/Users");
// const {client} = require("./initRedis");

// const { promisify } = require("util");
// client.get = promisify(client.get);

exports.createUser = async (req, res, next) => {
    // const userId = await client.get(req.session.userId);

    // if(userId){
    //     console.log("user exists", userId);
    //     res.end();
    //     return;
    // }

    const {_id} = await Users.create({});
    req.session.userId = _id;
    // await client.set(_id, true);
    next();
}