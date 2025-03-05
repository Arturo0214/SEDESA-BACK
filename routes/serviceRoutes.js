const express = require("express");
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
  bulkCreateServices
} = require("../controllers/serviceController");

router.get("/", getServices);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

router.post("/bulk", bulkCreateServices);

module.exports = router;