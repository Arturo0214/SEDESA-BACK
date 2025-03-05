const express = require("express");
const router = express.Router();
const { getFunctions, createFunction, updateFunction, deleteFunction } = require("../controllers/functionController");


router.get("/", getFunctions);
router.post("/", createFunction);
router.put("/:id", updateFunction);
router.delete("/:id", deleteFunction);

module.exports = router;
