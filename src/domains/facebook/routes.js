"use strict";

const express = require("express");
const { checkJwt } = require("../../middlewares/checkJwt");
const router = express.Router();

const controller = require("./controller");

router.get("/", controller.publicar);
router.get("/fb_access_token/:id", controller.receive_access_token);
router.get("/fb_pages/:id", [checkJwt], controller.get_facebook_pages);

module.exports = router;
