"use strict";
const base64 = require("base-64");
const checkJwt = (req, res, next) => {
  try {
    if (req && req.headers && req.headers.authorization) {
      const basic = req.headers.authorization;
      const secret = process.env.SECRET_KEY;

      console.log(basic);

      const reqBasic = base64.decode(basic.replace("Basic ", "")).split(":")[0];
      console.log(secret);
      if (reqBasic === secret) {
        next();
        // res.status(200).send('ok')
      } else {
        res.status(401).json({ message: "Invalid Auth" });
      }
    } else {
      next();
      // throw new Error("No Auth!");
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  checkJwt,
};
