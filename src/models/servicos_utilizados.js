"use strict";

const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  const ServicosUtilizados = sequelize.define(
    "ServicosUtilizados",
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
      validade: {
        type: DataTypes.STRING,
        field: "validade",
      },
    },
    {
      tableName: "servicos_utilizados",
      createdAt: false,
      updatedAt: false,
    }
  );

  return ServicosUtilizados;
};
