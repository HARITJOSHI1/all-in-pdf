const catchAsync = require('../utils/catchAsync');
const UsageModel = require('../models/Usage');

exports.addUsage = catchAsync(async (req, res, next) => {
  const { toolUsed } = req.body;
  const toolUsedDate = Date.now();
  // const { getDocId } = req.document;
  // console.log(getDocId());
   

  const data = await UsageModel.findOne({docId});
  if (data) data.save();
  else {
    await UsageModel.create({
      toolName: toolUsed,
      timestamp: toolUsedDate,
      timesUsed: 1,
      docId,
    });
  }

  // console.log(data);
  next();
});
