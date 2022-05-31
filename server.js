/**
 * Queria aqui deixar um recado pra todo mundo, muito obrigado pela oportunidade que vocês me deram.
 * Samuel, você é um cara muito gente boa, gostei bastante de trabalhar com vocês, Victor, um cara excepcional.
 * Kalil então nem se fala, outro cara que foi super gente boa comigo, me ajudou bastante no começo aqui na SoftKuka.
 * Um cara que eu nunca vou esquecer, foi ele que me concedeu essa primeira experiência.
 * Aprendi bastante coisa incrível e útil, que vou levar pro resto da vida, muitas coisas
 * interessantes, e também aprendi o que não fazer kkkkkkkkk (MEMES).
 * Amei todas as nossas brincadeiras e conversas nesse tempo que passamos juntos nessa trajetória que infelizmente não foi muito longa,
 * mas ainda agradeço a todos vocês, obrigado novamente pelo carinho que me deram, oportunidade e atenção, vocês acrescentaram muitas
 * coisas na minha vida
 *
 * Um abraço a todos, um abraço ao Victor, Samuel, Kalil, Vinícius (que só entrava pra zoar comigo kkkkkkk)
 *
 * Agradeço ao também Ronaldo por me conceder essa oportunidade. Um abraço a todos, lembrem-se de mim, sairemos todos de cabeça erguida.
 *
 * ~ Angelo
 * */

const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");

require("dotenv").config();

const { sequelize } = require("./src/models/index");
const SQL = require("mssql");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const { default: axios } = require("axios");

//routes
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.static(__dirname + "/public"));

app.use("/api/public", express.static(__dirname + "/public"));

app.use("/api/facebook", require("./src/domains/facebook/routes"));
app.use("/api/olx", require("./src/domains/olx/routes"));

//funcao main
function main() {
  const lis = app.listen({
    port: 8188,
  });
  lis.on("listening", async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database: ", error);
    }
  });

  cron.schedule(
    "* 10 * * *",
    async () => {
      const resp = await axios.get("http://localhost:8189/api/olx");
    },
    {
      scheduled: true,
      timezone: "America/Sao_Paulo",
    }
  );
}

process.on("unhandledRejection", (err) => {
  if (err) {
    console.error(err);
  }
  process.exit(1);
});

main();
