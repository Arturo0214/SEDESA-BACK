const FunctionModel = require("../models/functionModel");

// Obtener todas las funciones
const getFunctions = async (req, res) => {
  try {
    const functions = await FunctionModel.find();
    res.json(functions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las funciones" });
  }
};

// Crear una nueva función
const createFunction = async (req, res) => {
  try {
    const { name, description, area } = req.body;

    if (!name || !description || !area) {
      return res.status(400).json({ error: "Los campos 'name', 'area' y 'description' son obligatorios." });
    }

    const newFunction = new FunctionModel({ name, area, description });
    await newFunction.save();
    res.status(201).json(newFunction);
  } catch (error) {
    console.error("Error en createFunction:", error);
    res.status(500).json({ error: "Error al crear la función", details: error.message });
  }
};

// Actualizar una función
const updateFunction = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, area } = req.body;

    const updatedFunction = await FunctionModel.findByIdAndUpdate(
      id,
      { name, description, area },
      { new: true } // Devuelve el objeto actualizado
    );

    if (!updatedFunction) {
      return res.status(404).json({ error: "Función no encontrada" });
    }

    res.json(updatedFunction);
  } catch (error) {
    console.error("Error en updateFunction:", error);
    res.status(500).json({ error: "Error al actualizar la función", details: error.message });
  }
};

// Eliminar una función
const deleteFunction = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFunction = await FunctionModel.findByIdAndDelete(id);

    if (!deletedFunction) {
      return res.status(404).json({ error: "Función no encontrada" });
    }

    res.json({ message: "Función eliminada correctamente" });
  } catch (error) {
    console.error("Error en deleteFunction:", error);
    res.status(500).json({ error: "Error al eliminar la función", details: error.message });
  }
};

module.exports = { getFunctions, createFunction, updateFunction, deleteFunction };

