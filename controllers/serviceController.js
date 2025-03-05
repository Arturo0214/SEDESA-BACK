const ServiceModel = require("../models/serviceModel");

// Obtener todos los servicios
const getServices = async (req, res) => {
  try {
    const services = await ServiceModel.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

// Crear un nuevo servicio
const createService = async (req, res) => {
  try {
    const { name, description, area } = req.body;

    if (!name || !description || !area) {
      return res.status(400).json({ error: "Los campos 'name', 'area' y 'description' son obligatorios." });
    }

    const newService = new ServiceModel({ name, area, description });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error("Error en createService:", error);
    res.status(500).json({ error: "Error al crear el servicio", details: error.message });
  }
};

// Actualizar un servicio
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, area } = req.body;

    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      { name, description, area },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.json(updatedService);
  } catch (error) {
    console.error("Error en updateService:", error);
    res.status(500).json({ error: "Error al actualizar el servicio", details: error.message });
  }
};

// Eliminar un servicio
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await ServiceModel.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteService:", error);
    res.status(500).json({ error: "Error al eliminar el servicio", details: error.message });
  }
};

module.exports = { getServices, createService, updateService, deleteService };
