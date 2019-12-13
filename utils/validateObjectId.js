const mongoose = require('mongoose');

module.exports = ObjectId => {
  if (mongoose.Types.ObjectId.isValid(ObjectId)) return true;
  return false;
};
