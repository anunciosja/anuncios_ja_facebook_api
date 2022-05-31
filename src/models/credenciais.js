"use strict";

module.exports = (sequelize, DataTypes) => {
  const Credenciais = sequelize.define(
    "Credenciais",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        autoIncrement: true,
      },
      id_servico: {
        type: DataTypes.INTEGER,
        field: "id_servico",
      },
      id_cliente: {
        type: DataTypes.INTEGER,
        field: "id_cliente",
      },
      chave: {
        type: DataTypes.STRING,
        field: "chave",
      },
      valor: {
        type: DataTypes.STRING,
        field: "valor",
      },
      validade: {
        type: DataTypes.STRING,
        field: "validade",
      },
    },
    {
      tableName: "credenciais",
      createdAt: false,
      updatedAt: false,
    }
  );

  return Credenciais;
};
