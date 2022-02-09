"use strict";

const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define(
    "Cliente",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING,
        field: "nome",
      },
      email: {
        type: DataTypes.STRING,
        field: "email",
      },
      cnpj: {
        type: DataTypes.STRING,
        field: "cnpj",
      },
      cep: {
        type: DataTypes.STRING,
        field: "cep",
      },
      endereco: {
        type: DataTypes.STRING,
        field: "endereco",
      },
      nro: {
        type: DataTypes.STRING,
        field: "nro",
      },
      complemento: {
        type: DataTypes.STRING,
        field: "complemento",
      },
      bairro: {
        type: DataTypes.STRING,
        field: "bairro",
      },
      cidade: {
        type: DataTypes.STRING,
        field: "cidade",
      },
      enderUF: {
        type: DataTypes.STRING,
        field: "uf",
      },
      aceite: {
        type: DataTypes.BOOLEAN,
        field: "aceite",
      },
    },
    {
      tableName: "cliente",
      createdAt: false,
      updatedAt: false,
    }
  );

  sequelizePaginate.paginate(Cliente);

  Cliente.associate = (models) => {
    models.Cliente.hasMany(models.Login, {
      as: "login",
      foreignKey: "id_cliente",
    });
  };

  return Cliente;
};
