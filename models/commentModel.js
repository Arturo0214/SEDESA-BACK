const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comentario: { type: String, required: true },
  itemId: { type: String, required: true }, // Puede ser el ID del texto o contenido al que pertenece.
  autor: { type: String, default: "Anónimo" },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);