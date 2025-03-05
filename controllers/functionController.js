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
      { new: true }
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

// ✅ Carga masiva de funciones
const bulkCreateFunctions = async (req, res) => {
  try {
    const functionsArray = req.body;

    if (!Array.isArray(functionsArray) || functionsArray.length === 0) {
      return res.status(400).json({ error: "Debes enviar un array con funciones." });
    }

    // Validación opcional por si quieres asegurarte de que todos tienen name, description y area
    const invalidEntries = functionsArray.filter(
      (func) => !func.name || !func.description || !func.area
    );
    if (invalidEntries.length > 0) {
      return res.status(400).json({ error: "Todas las funciones deben tener 'name', 'description' y 'area'." });
    }

    await FunctionModel.insertMany(functionsArray);
    res.status(201).json({ message: "Funciones guardadas correctamente." });
  } catch (error) {
    console.error("Error en bulkCreateFunctions:", error);
    res.status(500).json({ error: "Error al guardar las funciones masivamente", details: error.message });
  }
};

module.exports = {
  getFunctions,
  createFunction,
  updateFunction,
  deleteFunction,
  bulkCreateFunctions
};