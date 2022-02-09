"use strict";

const sequelizePaginate = require("sequelize-paginate");

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
      id_veiculo: {
        type: DataTypes.INTEGER,
        field: "id_veiculo",
      },
      uid: {
        type: DataTypes.STRING,
        field: "uid",
      },
    },
    {
      tableName: "anuncio",
      createdAt: false,
      updatedAt: false,
    }
  );

  Anuncio.associate = (models) => {
    models.Anuncio.belongsTo(models.Veiculo, {
      as: "veiculo",
      foreignKey: "id_veiculo",
    });
  };

  sequelizePaginate.paginate(Anuncio);
  return Anuncio;
};
