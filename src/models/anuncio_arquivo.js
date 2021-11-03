"use strict";

module.exports = (sequelize, DataTypes) => {
  const AnuncioArquivo = sequelize.define(
    "AnuncioArquivo",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        autoIncrement: true,
      },
      id_anuncio: {
        type: DataTypes.INTEGER,
        field: "id_anuncio",
      },
      arquivo: {
        type: DataTypes.STRING,
        field: "arquivo",
      },
      type: {
        type: DataTypes.STRING,
        field: "type",
      },
      uid: {
        type: DataTypes.STRING,
        field: "uid",
      },
    },
    {
      tableName: "anuncio_arquivo",
      createdAt: false,
      updatedAt: false,
    }
  );

  return AnuncioArquivo;
};
