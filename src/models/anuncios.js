"use strict";

module.exports = (sequelize, DataTypes) => {
  const Anuncio = sequelize.define(
    "Anuncio",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        autoIncrement: true,
      },
      texto: {
        type: DataTypes.STRING,
        field: "texto",
      },
      data: {
        type: DataTypes.STRING,
        field: "data",
      },
      hora: {
        type: DataTypes.STRING,
        field: "hora",
      },
      data_hora: {
        type: DataTypes.STRING,
        field: "data_hora",
      },
      id_cliente: {
        type: DataTypes.INTEGER,
        field: "id_cliente",
      },
      uid: {
        type: DataTypes.STRING,
        field: "uid",
      },
    },
    {
      tableName: "Anuncio",
      createdAt: false,
      updatedAt: false,
    }
  );

  return Anuncio;
};
