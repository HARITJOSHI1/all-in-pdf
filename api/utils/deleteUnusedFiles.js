const EventEmitter = require("events");
const cron = require("node-cron");
const catchAsync = require("./catchAsync");
const Cleaner = require("./classes/Cleaner");
const Cookies = require("../utils/classes/Cookies");
const Response = require("./Response");

// const {client} = require("./initRedis");

// const { promisify } = require("util");
// client.get = promisify(client.get);

const events = new EventEmitter();

exports.scheduleDelete = catchAsync(async (req, res, next) => {
  if (!Cookies.getCookie(req, "jwt")) {
    const { userId } = req.session;
    const scheduleTimer = "*/60 * * * *";
    let allClean = false;

    const task = cron.schedule(scheduleTimer, async () => {
      if (
        await Promise.all([
          Cleaner.cleanFromDB(userId),
          Cleaner.cleanFromFS(req.filename),
          Cleaner.cleanTempUser(userId),
        ])
      ) {
        allClean = true;
        events.emit("cleanup-complete", allClean);
      }
    });

    events.on("cleanup-complete", async (allClean) => {
      allClean ? task.stop() : null;
      events.removeAllListeners();
      // await client.del("userId");
    });
  }

  new Response(res, 200, "success", req.msg, req.filename);
});
