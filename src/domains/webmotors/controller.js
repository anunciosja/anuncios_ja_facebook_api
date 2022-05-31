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
const { XMLParser, XMLBuilder, XMLValidator} = require('fast-xml-parser');



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
      servico: 4,
    });

    let anuncios = await Anuncio.findAll(
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
          // data_hora: data_atual.format("YYYY/MM/DD HH:mm"),
          data_hora: {
            $gte: data_atual.startOf('day').format("YYYY/MM/DD HH:mm"),
            $lte: data_atual.endOf('day').format("YYYY/MM/DD HH:mm"),
          }
        },
      }
    );

    
    // anuncios = [ anuncios[0] ]
    // console.log(anuncios)
    await Promise.all(
      anuncios.map(async (anuncio) => {
        const isWEBMOTORS = await AnuncioServico.findOne({
          where: {
            id_anuncio: anuncio.id,
            id_servico: 4,
          },
        });

        console.log('O IS AQUI', isWEBMOTORS)
        if (isWEBMOTORS) {
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
              id_servico: 4,
            },
          });

          // const CNPJ = credenciais.find((f) => f.chave === "WEB_CNPJ");
          // const EMAIL = credenciais.find((f) => f.chave === "WEB_EMAIL");
          // const SENHA = credenciais.find((f) => f.chave === "WEB_SENHA");

          const CNPJ = '07666147000164';
          const EMAIL = 'socav51105@porjoton.com';
          const SENHA = 'WebMotors@';

          //logar na webmotors

          const requestIndo = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <autenticar xmlns="www.webmotors.com.br/wsLoginSistemaRevendedor">
              <cnpj>${CNPJ}</cnpj>
              <email>${EMAIL}</email>
              <senha>${SENHA}</senha>
            </autenticar>
          </soap:Body>
        </soap:Envelope>`;


          
          const { data } = await axios.post('https://hportal.webmotors.com.br/IntegracaoRevendedor/wsLoginSistemaRevendedor.asmx', requestIndo, {
            headers: {
              // 'Authorization': `Basic ${hash_tk}`,
              'Content-Type': 'text/xml',
              'SOAPAction': '"www.webmotors.com.br/wsLoginSistemaRevendedor/autenticar"',
              'Content-Length': requestIndo.length
            }
          });

          const parser = new XMLParser();
          let jObj = parser.parse(data);
          const autenticarResult = jObj['soap:Envelope']['soap:Body']['autenticarResponse']
            && jObj['soap:Envelope']['soap:Body']['autenticarResponse']['autenticarResult']

          const token = autenticarResult.HashAutenticacao

          const codRetorno = autenticarResult.CodigoRetorno

          if (codRetorno != 200) {
            console.log('deu erro na autenticacao');

            //deu sucesso no login
          } else {
            const uid = await Bcrypt.hash(veiculo.id.toString(), 10);

            const dadosCarro = `<soap:Envelope
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xmlns:xsd="http://www.w3.org/2001/XMLSchema"
              xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <IncluirCarro
                  xmlns="www.webmotors.com.br/wsEstoqueRevendedorWebMotors">
                  <pHashAutenticacao>${token}</pHashAutenticacao>
                  <pAnuncio>
                    <CodigoAnuncio>${uid}</CodigoAnuncio>
                    <CodigoModalidade>${veiculo.codigoMarca}</CodigoModalidade>
                    <TipoAnuncio>N</TipoAnuncio>
                    <CodigoMarca>${veiculo.codigoMarca}</CodigoMarca>
                    <CodigoModelo>${veiculo.codigoMarca}</CodigoModelo>
                    <CodigoVersao>${veiculo.codigoMarca}</CodigoVersao>
                    <AnoDoModelo>${+veiculo.ano}</AnoDoModelo>
                    <AnoFabricacao>${+veiculo.ano}</AnoFabricacao>
                    <Km>${veiculo.quilometragem}</Km>
                    <Placa>${veiculo.placa}</Placa>
                    <CodigoCambio>${veiculo.cambio}</CodigoCambio>
                    <NrPortas>${veiculo.portas}</NrPortas>
                    <CorExterna>${veiculo.cor}</CorExterna>
                    <Combustivel>${combustivel[0].combustivel}</Combustivel>
                    <CodigoCombustivel>${combustivel[0].combustivel}</CodigoCombustivel>
                    <Blindado>${veiculo.blindado}</Blindado>
                    <AdaptadoDeficientesFisicos>${veiculo.adaptadoDeficiente}</AdaptadoDeficientesFisicos>
                    <UnicoDono>${veiculo.unicoDono}</UnicoDono>
                    <Alienado>${veiculo.alienado}</Alienado>
                    <IpvaPago>${veiculo.ipva}</IpvaPago>
                    <NaoAceitaTroca>N</NaoAceitaTroca>
                    <RevisadoOficinaAgendaDoCarro>${veiculo.revisadoOficina}</RevisadoOficinaAgendaDoCarro>
                    <RevisoesEmConcessionaria>${veiculo.revisadoConcessionaria}</RevisoesEmConcessionaria>
                    <GarantiaDeFabrica>${veiculo.garantiaFabrica}</GarantiaDeFabrica>
                    <Licenciado>${veiculo.licenciado}</Licenciado>
                    <PrecoReal>${veiculo.valor}</PrecoReal>
                    <PrecoVenda>${veiculo.valor}</PrecoVenda>
                    <DataInclusao>${moment().format('YYYY-MM-DD HH:mm:ss')}</DataInclusao>
                    <DataUltimaAlteracao>${moment().format('YYYY-MM-DD HH:mm:ss')}</DataUltimaAlteracao>
                  </pAnuncio>
                </IncluirCarro>
              </soap:Body>
            </soap:Envelope>`;


            const { data: responseCarro } = await axios.post('https://hportal.webmotors.com.br/IntegracaoRevendedor/wsEstoqueRevendedorWebMotors.asmx', dadosCarro, {
              headers: {
                // 'Authorization': `Basic ${hash_tk}`,
                'Content-Type': 'text/xml',
                'SOAPAction': '"www.webmotors.com.br/wsEstoqueRevendedorWebMotors/IncluirCarro"',
                'Content-Length': dadosCarro.length
              }
            });

            let jObjCarro = parser.parse(responseCarro);
            const carroResult = jObjCarro['soap:Envelope']['soap:Body']['autenticarResponse']
              && jObjCarro['soap:Envelope']['soap:Body']['IncluirCarroResponse']['IncluirCarroResult']

              //incluir as fotos depois de incluir o carro

              // carroResult -> esse é o objeto do carro, já está em json
              
              /*
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                  <soap:Body>
                    <IncluirFoto xmlns="www.webmotors.com.br/wsEstoqueRevendedorWebMotors">
                      <pHashAutenticacao>${token}</pHashAutenticacao>
                      <pByteImage>base 64 da imagem</pByteImage>
                      <pCodigoAnuncio>${uid}</pCodigoAnuncio>
                    </IncluirFoto>
                  </soap:Body>
                </soap:Envelope>
              */ 


            console.log(autenticarResult)
            console.log(carroResult)
          }

          // descomentar depois
          // await Anuncio.update({ uid: uid }, { where: { id: anuncio.id } });
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
