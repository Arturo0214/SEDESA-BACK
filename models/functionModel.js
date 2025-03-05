const mongoose = require("mongoose");

const functionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  area: {type: String, required: true}
});

module.exports = mongoose.model("Function", functionSchema);
