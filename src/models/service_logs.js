"use strict";

module.exports = (sequelize, DataTypes) => {
  const ServiceLogs = sequelize.define(
    "ServiceLogs",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        autoIncrement: true,
      },
      descricao: {
        type: DataTypes.STRING,
        field: "descricao",
      },
      data_hora: {
        type: DataTypes.STRING,
        field: "data_hora",
      },
      servico: {
        type: DataTypes.INTEGER,
        field: "servico",
      },
    },
    {
      tableName: "service_logs",
      createdAt: false,
      updatedAt: false,
    }
  );

  return ServiceLogs;
};
