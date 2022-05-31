"use strict";

const { default: axios } = require("axios");
const { response } = require("express");
const {
  Login,
  Op,
  ServicosUtilizados,
  Credenciais,
  Anuncio,
  AnuncioServico,
  AnuncioArquivo,
  ServiceLogs,
  Veiculo,
  VeiculoFotos,
  VeiculoCombustivel,
} = require("./../../models");
const moment = require("moment");
const Bcrypt = require("bcrypt");
const publicar = async (req, res) => {
  try {
    const COMBUSTIVEIS = {
      Gasolina: 1,
      Etanol: 2,
      Flex: 3,
      GNV: 4,
      Diesel: 5,
    };

    const MOTORPOWER = {
      1: 1,
      "1.0": 1,
      1.2: 2,
      1.3: 3,
      1.4: 4,
      1.5: 5,
      1.6: 6,
      1.7: 7,
      1.8: 8,
      1.9: 9,
      "2.0": 10,
      2: 10,
      2.1: 10,
      2.2: 10,
      2.3: 10,
      2.4: 10,
      2.5: 10,
      2.6: 10,
      2.7: 10,
      2.8: 10,
      2.9: 10,
      "3.0": 11,
      3: 11,
      3.1: 11,
      3.2: 11,
      3.3: 11,
      3.4: 11,
      3.5: 11,
      3.6: 11,
      3.7: 11,
      3.8: 11,
      3.9: 11,
      "4.0": 12,
      4: 12,
      4.1: 12,
      4.2: 12,
      4.3: 12,
      4.4: 12,
      4.5: 12,
      4.6: 12,
      4.7: 12,
      4.8: 12,
      4.9: 12,
    };

    const data_atual = moment();

    await ServiceLogs.create({
      descricao: `última execução Às ${data_atual.format("YYYY/MM/DD HH:mm")}`,
      servico: 3,
    });

    const anuncios = await Anuncio.findAll(
      {
        include: [
          {
            model: Veiculo,
            as: "veiculo",
            include: [
              {
                model: VeiculoFotos,
                as: "fotos",
              },
              {
                model: VeiculoCombustivel,
                as: "combustivel",
              },
            ],
          },
        ],
      },
      {
        where: {
          data_hora: data_atual.format("YYYY/MM/DD HH:mm"),
        },
      }
    );

    await Promise.all(
      anuncios.map(async (anuncio) => {
        const isOLX = await AnuncioServico.findOne({
          where: {
            id_anuncio: anuncio.id,
            id_servico: 3,
          },
        });

        if (isOLX) {
          //marca
          //modelo
          //ano
          //motor
          //quilometragem
          //valor
          //tipo -- importante

          const arquivos = await VeiculoFotos.findAll({
            where: {
              id_veiculo: anuncio.id_veiculo,
            },
          });

          const veiculo = await Veiculo.findOne({
            where: { id: anuncio.id_veiculo },
          });

          const combustivel = await VeiculoCombustivel.findAll({
            where: { id_veiculo: veiculo.id },
          });

          //obter credenciais
          const credenciais = await Credenciais.findAll({
            where: {
              id_cliente: anuncio.id_cliente,
              id_servico: 3,
            },
          });

          const token = credenciais.find((f) => f.chave === "OLX_TOKEN");

          const salt = credenciais.find((f) => f.chave === "OLX_SALT");

          const uid = await Bcrypt.hash(veiculo.id, salt);

          const categoria =
            veiculo.tipo === "carros"
              ? 2020
              : veiculo.tipo === "caminhões"
              ? 2040
              : 2060;

          const cliente = await Cliente.findOne({
            where: { id: anuncio.id_cliente },
          });

          const potencia_motor = veiculo.motor.trim().split(" ")[0];

          const obj = {
            access_token: token.valor,
            ad_list: [
              {
                id: uid.substring(0, 19),
                operation: "insert",
                category: categoria,
                Subject: `${veiculo.marca} ${veiculo.modelo}`,
                Body: veiculo.descricao,
                Phone: cliente.telefone,
                type: "s",
                price: veiculo.valor.replace(".", "").replace(",", ""),
                zipcode: cliente.cep,
                images: arquivos.map((a) => a.arquivo),
                params: {
                  regdate: +veiculo.ano,
                  //gearbox: "1",
                  fuel: COMBUSTIVEIS[combustivel[0].combustivel],
                  //car_features: ["1", "2", "3"],
                  //doors: "2",
                  //end_tag: "10",
                  //car_steering: "1",
                  motorpower: MOTORPOWER[potencia_motor],
                  //cartype: "1",
                  //carcolor: "1",
                  exchange: "2",
                },
              },
            ],
          };

          await Anuncio.update({ uid: uid }, { where: { id: anuncio.id } });
        }
      })
    );

    res.send("ok");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    return;
  }
};

module.exports = {
  publicar,
};
