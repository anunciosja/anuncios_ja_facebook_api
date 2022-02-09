"use strict";

module.exports = (sequelize, DataTypes) => {
  const VeiculoCombustivel = sequelize.define(
    "VeiculoCombustivel",
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
      combustivel: {
        type: DataTypes.STRING,
        field: "combustivel",
      },
    },
    {
      tableName: "veiculo_combustivel",
      createdAt: false,
      updatedAt: false,
    }
  );

  VeiculoCombustivel.associate = (models) => {
    models.VeiculoCombustivel.belongsTo(models.Veiculo, {
      as: "veiculo",
      foreignKey: "id",
    });
  };
  return VeiculoCombustivel;
};
