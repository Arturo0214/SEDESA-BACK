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

// Carga masiva de servicios
const bulkCreateServices = async (req, res) => {
  try {
    const servicesArray = req.body;

    if (!Array.isArray(servicesArray) || servicesArray.length === 0) {
      return res.status(400).json({ error: "Debes enviar un array con servicios." });
    }

    const invalidEntries = servicesArray.filter(
      (service) => !service.name || !service.description || !service.area
    );

    if (invalidEntries.length > 0) {
      return res.status(400).json({ error: "Todos los servicios deben tener 'name', 'description' y 'area'." });
    }

    await ServiceModel.insertMany(servicesArray);
    res.status(201).json({ message: "Servicios guardados correctamente." });
  } catch (error) {
    console.error("Error en bulkCreateServices:", error);
    res.status(500).json({ error: "Error al guardar los servicios masivamente", details: error.message });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
  bulkCreateServices
};

