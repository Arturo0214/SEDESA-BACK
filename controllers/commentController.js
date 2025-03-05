const Comment = require("../models/commentModel");

// Crear comentario
const createComment = async (req, res) => {
  const { comentario, itemId, autor } = req.body;

  try {
    const newComment = await Comment.create({ comentario, itemId, autor });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error en createComment:", error);
    res.status(500).json({ message: "Error al crear el comentario", details: error.message });
  }
};

// Obtener comentarios por itemId
const getCommentsByItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const comments = await Comment.find({ itemId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error en getCommentsByItem:", error);
    res.status(500).json({ message: "Error al obtener los comentarios", details: error.message });
  }
};

// Actualizar comentario
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { comentario } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, { comentario }, { new: true });

    if (!updatedComment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error en updateComment:", error);
    res.status(500).json({ message: "Error al actualizar el comentario", details: error.message });
  }
};

// Eliminar comentario
const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteComment:", error);
    res.status(500).json({ message: "Error al eliminar el comentario", details: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByItem,
  updateComment,
  deleteComment,
};
