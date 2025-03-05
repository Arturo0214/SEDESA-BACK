const express = require("express");
const router = express.Router();
const { getFunctions, createFunction, updateFunction, deleteFunction, bulkCreateFunctions } = require("../controllers/functionController");


router.get("/", getFunctions);
router.post("/", createFunction);
router.put("/:id", updateFunction);
router.delete("/:id", deleteFunction);
router.post("/bulk", bulkCreateFunctions);

module.exports = router;
