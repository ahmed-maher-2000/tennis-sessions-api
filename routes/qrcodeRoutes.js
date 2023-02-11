const express = require("express");
const router = express.Router();
const protect = require("../controllers/authController/protect");

router.use(protect);

module.exports = router;
