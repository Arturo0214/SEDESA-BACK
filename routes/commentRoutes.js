const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByItem,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

// Crear un nuevo comentario
router.post("/", createComment);

// Obtener todos los comentarios relacionados a un itemId específico
router.get("/:itemId", getCommentsByItem);

// Actualizar un comentario por su ID
router.patch("/:id", updateComment);

// Eliminar un comentario por su ID
router.delete("/:id", deleteComment);

module.exports = router;
