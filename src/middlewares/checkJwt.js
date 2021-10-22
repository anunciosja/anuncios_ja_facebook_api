"use strict";

const checkJwt = (req, res, next) => {
  const token_raw = req.headers.authorization;

  if (!token_raw || !token_raw.startsWith("Basic")) {
    res.status(401).json({
      message: "Invalid token!",
    });
    return;
  }

  const basic = req.headers.authorization;
  const secret = process.env.SECRET_KEY;

  const reqBasic = base64.decode(basic.replace("Basic ", "")).split(":")[0];

  if (reqBasic === secret) {
    next();
  } else {
    res.status(401).json({ message: "Invalid Auth" });
  }

  next();
};

module.exports = {
  checkJwt,
};
