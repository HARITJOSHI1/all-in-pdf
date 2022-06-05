const { createClient } = require("redis");

const client = createClient("redis://127.0.0.1:6379");
client.connect();

// (async () => {
//   client.on("error", (err) => console.log("Redis Client Error", err));
// })();


exports.client = client;
