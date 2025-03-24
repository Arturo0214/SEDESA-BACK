const Function = require("../models/functionModel");
const Service = require("../models/serviceModel");
const Match = require("../models/matchModel");
const stringSimilarity = require("string-similarity");

const cleanText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
};

const getMatches = async (req, res) => {
  try {
    // Si ya hay matches guardados, los devolvemos directamente
    const existing = await Match.find({});
    if (existing.length > 0) {
      console.log("Enviando matches guardados");
      return res.json(existing);
    }

    // Cargar funciones y servicios desde MongoDB
    const functions = await Function.find({});
    const services = await Service.find({});
    const matches = [];

    for (const func of functions) {
      const cleanedFuncName = cleanText(func.name);
      const cleanedFuncDesc = cleanText(func.description || "");
      const cleanedFuncArea = cleanText(func.area || "");

      for (const service of services) {
        const cleanedServiceName = cleanText(service.name);
        const cleanedServiceDesc = cleanText(service.description || "");
        const cleanedServiceArea = cleanText(service.area || "");

        const nameSim = stringSimilarity.compareTwoStrings(cleanedFuncName, cleanedServiceName);
        const descSim = stringSimilarity.compareTwoStrings(cleanedFuncDesc, cleanedServiceDesc);
        const areaSim = stringSimilarity.compareTwoStrings(cleanedFuncArea, cleanedServiceArea);

        const totalSim = nameSim * 0.5 + descSim * 0.4 + areaSim * 0.1;

        if (totalSim >= 0.6) {
          matches.push({
            func,
            service,
            similarity: totalSim,
          });
        }
      }
    }

    // Guardar todos los matches en la colección
    await Match.insertMany(matches);
    console.log(`Matches calculados y guardados: ${matches.length}`);
    res.json(matches);
  } catch (error) {
    console.error("Error en getMatches:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

module.exports = { getMatches };
