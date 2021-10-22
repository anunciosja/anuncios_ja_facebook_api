"use strict";

const publicar = async (req, res) => {
  try {
    res.send("ok");
    return;
  } catch (error) {
    res.status(500).send({ error: error.message });
    return;
  }
};
module.exports = {
  publicar,
};
