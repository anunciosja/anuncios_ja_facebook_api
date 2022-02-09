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
  VeiculoCombustivel,
  VeiculoFotos,
  Veiculo,
} = require("./../../models");
const moment = require("moment");
const crypto = require("crypto");

const publicar = async (req, res) => {
  try {
    const data_atual = moment();

    await ServiceLogs.create({
      descricao: `última execução Às ${data_atual.format("YYYY/MM/DD HH:mm")}`,
      servico: 1,
    });

    const anuncios = await Anuncio.findAll({
      where: {
        data_hora: { [Op.lte]: data_atual.format("YYYY/MM/DD HH:mm") },
        uid: null,
        id_cliente: 3,
      },
    });

    let _anuncios_uid = [];

    await Promise.all(
      anuncios.map(async (anuncio) => {
        const isFacebook = await AnuncioServico.findOne({
          where: {
            id_anuncio: anuncio.id,
            id_servico: 1,
          },
        });

        const arquivos = await VeiculoFotos.findAll({
          where: {
            id_veiculo: anuncio.id_veiculo,
          },
        });

        if (isFacebook) {
          const credenciais = await Credenciais.findAll({
            where: {
              id_cliente: anuncio.id_cliente,
              id_servico: 1,
            },
          });

          const user_access_token = credenciais.find(
            (f) => f.chave === "FACEBOOK_ACCESS_TOKEN"
          );
          const page_id = credenciais.find((f) => f.chave === "FACEBOOK_PAGE");

          const url_page_token = `https://graph.facebook.com/${
            page_id.valor.split("@")[0]
          }?fields=access_token`;

          let response = await axios.get(url_page_token, {
            params: {
              access_token: user_access_token.valor,
            },
          });

          const access_token = response.data.access_token;

          const file_ids = [];

          await Promise.all(
            arquivos.map(async (arquivo) => {
              const url =
                arquivo.type === "image"
                  ? `https://graph.facebook.com/v12.0/${
                      page_id.valor.split("@")[0]
                    }/photos`
                  : `https://graph.facebook.com/v12.0/${
                      page_id.valor.split("@")[0]
                    }/videos`;

              response = await axios.post(url, {
                access_token: access_token,
                url: arquivo.arquivo,
                published: false,
                temporary: true,
              });

              const { id } = response.data;

              await VeiculoFotos.update(
                { uid: id },
                { where: { id: arquivo.id_veiculo } }
              );

              file_ids.push(id);
            })
          );

          const veiculo = await Veiculo.findOne({
            where: { id: anuncio.id_veiculo },
          });

          const combustivel = await VeiculoCombustivel.findAll({
            where: { id_veiculo: veiculo.id },
          });

          let params = {
            message: `Marca: ${veiculo.marca}\nModelo: ${
              veiculo.modelo
            }\nAno: ${veiculo.ano}\nMotor: ${veiculo.motor}\nQuilometragem: ${
              veiculo.quilometragem
            }\nCombustível: ${combustivel
              .map((m) => m.combustivel)
              .join(", ")}\nValor: ${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "BRL",
            }).format(veiculo.valor)}\n${veiculo.descricao}`,
          };

          const medias = file_ids.map((_id, index) => {
            return {
              media_fbid: _id,
            };
          });

          const url = `https://graph.facebook.com/v12.0/${
            page_id.valor.split("@")[0]
          }/feed?access_token=${access_token}`;

          params.attached_media = medias;

          response = await axios.post(url, params);
          const id_post = response.data.id;

          const updt = await Anuncio.update(
            { uid: id_post },
            { where: { id: anuncio.id } }
          );
        }
      })
    );

    // const url = `https://graph.facebook.com/v12.0/${page_id}/photos`;

    // const response = await axios.post(url, {
    //   access_token: accessToken,
    //   message: "Teste Postagem",
    //   url: `https://anunciosja.kkvasconcelosme.com.br/api/public/background.jpg`,
    // });

    res.send("ok");
    return;
  } catch (error) {
    console.log(error?.response?.data?.error);
    res.status(500).send({ error: error.message });
    return;
  }
};

const receive_access_token = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.query;

    //https://www.facebook.com/v12.0/dialog/oauth?client_id=568341104391045&redirect_uri=http://localhost:8188/api/facebook/fb_access_token&state="{st:state123abc,ds:123456789}"

    const { data } = await axios({
      url: "https://graph.facebook.com/v12.0/oauth/access_token",
      method: "get",
      params: {
        client_id: "568341104391045",
        client_secret: "fbb88c21b60b5adc644cfb7c81792e3a",
        redirect_uri: `http://localhost:8188/api/facebook/fb_access_token/${id}`,
        code: body.code,
      },
    });
    if (data) {
      const { access_token, token_type, expires_in } = data;

      await Credenciais.destroy({
        where: {
          id_cliente: id,
          id_servico: 1,
          chave: "FACEBOOK_ACCESS_TOKEN",
        },
      });
      const validade = moment()
        .add(expires_in, "seconds")
        .format("YYYY/MM/DD HH:mm:ss");

      await Credenciais.create({
        id_servico: 1,
        id_cliente: id,
        chave: "FACEBOOK_ACCESS_TOKEN",
        valor: access_token,
        validade: validade,
      });

      const utilizado = await ServicosUtilizados.findOne({
        where: { id_servico: 1, id_cliente: id },
      });
      if (!utilizado) {
        await ServicosUtilizados.create({
          id_servico: 1,
          id_cliente: id,
          validade: validade,
        });
      } else {
        await ServicosUtilizados.update(
          { validade: validade },
          {
            where: {
              id_servico: 1,
              id_cliente: id,
            },
          }
        );
      }

      res.send("<script>window.close();</script>");
      return;
    }
  } catch (error) {
    console.log(error.response?.data?.error);
  }
};

const get_facebook_pages = async (req, res) => {
  try {
    const { id } = req.params;

    const credencial = await Credenciais.findOne({
      where: { id_cliente: id, chave: "FACEBOOK_ACCESS_TOKEN" },
    });

    //https://graph.facebook.com/me/accounts
    const { data: response } = await axios({
      url: "https://graph.facebook.com/me/accounts",
      method: "get",
      params: {
        access_token: credencial.valor,
      },
    });

    const { data } = response;

    const arr = [];

    data.map((d) => arr.push({ key: d.id, value: d.id, text: d.name }));

    res.send(arr);
    return;
  } catch (error) {
    res.send({ error: error.message });
    return;
  }
};

const get_likes = async (req, res) => {
  try {
    const { id } = req.params;

    //Depois pegamos isso

    // const { token } = req.body;

    // const { data } = await axios.get(
    //   `https://graph.facebook.com/${id}?fields=reactions.summary(total_count)&access_token=${token}`
    // );
  } catch (error) {
    res.send({ error: error.message });
    return;
  }
};

const delete_posts = async (req, res) => {
  try {
    const { id } = req.params;

    const data_atual = moment();

    const anuncios = await Anuncio.findAll({
      where: {
        id_veiculo: id,
      },
    });

    await Promise.all(
      anuncios.map(async (anuncio) => {
        const isFacebook = await AnuncioServico.findOne({
          where: {
            id_anuncio: anuncio.id,
            id_servico: 1,
          },
        });

        if (isFacebook) {
          const credenciais = await Credenciais.findAll({
            where: {
              id_cliente: anuncio.id_cliente,
              id_servico: 1,
            },
          });

          const user_access_token = credenciais.find(
            (f) => f.chave === "FACEBOOK_ACCESS_TOKEN"
          );
          const page_id = credenciais.find((f) => f.chave === "FACEBOOK_PAGE");

          const url_page_token = `https://graph.facebook.com/v13.0/${
            page_id.valor.split("@")[0]
          }?fields=access_token`;

          let response = await axios.get(url_page_token, {
            params: {
              access_token: user_access_token.valor,
            },
          });

          const access_token = response.data.access_token;
          // const access_token = user_access_token.valor;
          try {
            const url_delete_post = `https://graph.facebook.com/v13.0/${anuncio.uid}/`;

            response = await axios.delete(url_delete_post, {
              params: {
                access_token:
                  "568341104391045|fbb88c21b60b5adc644cfb7c81792e3a",
                //access_token,
              },
            });
          } catch (error) {
            await ServiceLogs.create({
              descricao: `Erro de exclusão de postagem :${error?.response?.data?.error?.message}`,
              servico: 1,
            });
          }

          // fb.options({
          //   version: "13.0",
          //   appId: "568341104391045",
          //   appSecret: "fbb88c21b60b5adc644cfb7c81792e3a",
          //   accessToken: access_token,
          // });

          // fb.api(`${anuncio.uid}`, "delete", async (res) => {
          //   if (!res || res.error) {
          //     return;
          //   }

          await Anuncio.destroy({ where: { id: anuncio.id } });
          // });
        }
      })
    );

    await VeiculoCombustivel.destroy({ where: { id_veiculo: id } });
    await VeiculoFotos.destroy({ where: { id_veiculo: id } });
    await Veiculo.destroy({ where: { id: id } });

    res.send("ok");
    return;
  } catch (error) {
    console.log(error.message);
    console.log(error?.response?.data?.error);
    res.status(500).send({ error: error.message });
    return;
  }
};

module.exports = {
  publicar,
  receive_access_token,
  get_facebook_pages,
  delete_posts,
};
