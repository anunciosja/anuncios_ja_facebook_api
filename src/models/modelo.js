"use strict";

module.exports = (sequelize, DataTypes) => {
  const Modelos = sequelize.define(
    "Modelos",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
      },
      modelo: {
        type: DataTypes.STRING,
        field: "modelo",
      },
      tipo: {
        type: DataTypes.STRING,
        field: "tipo",
      },
    },
    {
      tableName: "modelos",
      createdAt: false,
      updatedAt: false,
    }
  );

  return Modelos;
};
