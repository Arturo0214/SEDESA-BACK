// models/matchModel.js
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  func: {
    type: Object,
    required: true,
  },
  service: {
    type: Object,
    required: true,
  },
  similarity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Match", matchSchema);

