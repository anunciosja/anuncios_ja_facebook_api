"use strict";

const express = require("express");

const router = express.Router();
const { checkJwt } = require("../../middlewares/checkJwt");
router.get("/documentacao", [checkJwt], async (req, res) => {
  let html = "";
  html += "<br/>";
  html += "<h3>Bem vindo à documentação da api Anuncios Já</h3>";
  html += "<br/>";
  html += "<h3>Login</h3>";
  html += "<table cellSpacing='0'>";
  html += "<tr>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Rota</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Método</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Descrição</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Parâmetros</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Retorno</strong></td>";
  html += "</tr>";

  html += "<tr>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>/auth/login</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>POST</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de Login</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>{email:'',password:''}</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>JWT Token com validade de 8h</td>";
  html += "</tr>";

  html += "<tr>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>/auth/auth_validate/:email</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>GET</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de Validação de usuário já existente</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>Email</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>{existe: true ou false}</td>";
  html += "</tr>";

  html += "<tr>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>/auth/auth_create</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>POST</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de criação de usuários e clientes</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>{nome:'teste usuario',cnpj:'289.791.510-20',email:'teste@teste.com',cep:'92020570',endereco:'Rua Teste',";
  html +=
    "nro':'1',complemento:'',bairro:'Teste',cidade:'Teste',uf:'TS',password:'minhasupersenha'}</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>JWT Token com validade de 8h</td>";
  html += "</tr>";

  html += "<tr>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>/auth/update/cliente/:id</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>PUT</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de alteração de usuários e cliente no perfil</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>usuário: id do cliente, nome, email, nivel e foto</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>Dados atualizados</td>";
  html += "</tr>";

  html += "<tr>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>/auth/update/:id</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>PUT</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de alteração de usuários</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>usuário: id do cliente, nome, email, nivel e foto</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>Dados atualizados</td>";
  html += "</tr>";

  html += "</table>";

  html += "<br/>";
  html += "<h3>Cliente</h3>";
  html += "<table cellSpacing='0'>";
  html += "<tr>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Rota</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Método</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Descrição</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Parâmetros</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Retorno</strong></td>";
  html += "</tr>";

  html += "<tr>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>/clientes</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>GET</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de Login</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>search</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>listagem de clientes</td>";
  html += "</tr>";

  html += "<tr>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>/clientes/validar/:cnpj</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>GET</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de Validação de CPF/CNPJ duplicado</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>cnpj</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>{existe:true ou false}</td>";
  html += "</tr>";
  html += "</table>";

  html += "<br/>";
  html += "<h3>Usuários</h3>";
  html += "<table cellSpacing='0'>";
  html += "<tr>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Rota</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Método</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Descrição</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Parâmetros</strong></td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'><strong>Retorno</strong></td>";
  html += "</tr>";

  html += "<tr>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>/user</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>GET</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de consulta de usuários</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'> page, limit e search </td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>listagem de usuários</td>";
  html += "</tr>";

  html += "<tr>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>/user</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>POST</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de criação de usuários</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>{nivel,nome,email,password,id_cliente}</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>Usuário criado</td>";
  html += "</tr>";

  html += "<tr>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>/user/ativar/:id</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>PUT</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de ativação de usuários</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>id do usuário</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>Usuário ativado</td>";
  html += "</tr>";

  html += "<tr>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>/user/desativar/:id</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>PUT</td>";
  html +=
    "<td style='border:1px solid rgba(0,0,0,.6)'>Rota de desativação de usuários</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>id do usuário</td>";
  html += "<td style='border:1px solid rgba(0,0,0,.6)'>Usuário desativado</td>";
  html += "</tr>";
  html += "</table>";
  html += "<br/>";
  html += "<br/>";

  res.send(html);
  return;
});

module.exports = router;
