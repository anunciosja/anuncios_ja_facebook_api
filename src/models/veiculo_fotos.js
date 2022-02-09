"use strict";

module.exports = (sequelize, DataTypes) => {
  const VeiculoFotos = sequelize.define(
    "VeiculoFotos",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        autoIncrement: true,
      },
      id_veiculo: {
        type: DataTypes.INTEGER,
        field: "id_veiculo",
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
      tableName: "veiculo_fotos",
      createdAt: false,
      updatedAt: false,
    }
  );

  VeiculoFotos.associate = (models) => {
    models.VeiculoFotos.belongsTo(models.Veiculo, {
      as: "veiculo",
      foreignKey: "id",
    });
  };

  return VeiculoFotos;
};
