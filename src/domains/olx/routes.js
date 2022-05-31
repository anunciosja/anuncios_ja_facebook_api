"use strict";

const express = require("express");
const { checkJwt } = require("../../middlewares/checkJwt");
const router = express.Router();

const controller = require("./controller");

router.get("/publicar", controller.publicar);

module.exports = router;
