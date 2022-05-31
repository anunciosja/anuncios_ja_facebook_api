"use strict";

module.exports = (sequelize, DataTypes) => {
  const AnuncioServico = sequelize.define(
    "AnuncioServico",
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
      id_servico: {
        type: DataTypes.INTEGER,
        field: "id_servico",
      },
    },
    {
      tableName: "anuncio_servico",
      createdAt: false,
      updatedAt: false,
    }
  );

  return AnuncioServico;
};
