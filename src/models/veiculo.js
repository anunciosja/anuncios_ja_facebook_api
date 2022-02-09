"use strict";
const sequelizePaginate = require("sequelize-paginate");
module.exports = (sequelize, DataTypes) => {
  const Veiculo = sequelize.define(
    "Veiculo",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        autoIncrement: true,
      },
      id_cliente: {
        type: DataTypes.INTEGER,
        field: "id_cliente",
      },
      tipo: {
        type: DataTypes.STRING,
        field: "tipo",
      },
      marca: {
        type: DataTypes.STRING,
        field: "marca",
      },
      codigoMarca: {
        type: DataTypes.STRING,
        field: "codigomarca",
      },
      modelo: {
        type: DataTypes.STRING,
        field: "modelo",
      },
      codigoModelo: {
        type: DataTypes.STRING,
        field: "codigomodelo",
      },
      ano: {
        type: DataTypes.STRING,
        field: "ano",
      },
      motor: {
        type: DataTypes.STRING,
        field: "motor",
      },
      quilometragem: {
        type: DataTypes.DECIMAL,
        field: "quilometragem",
      },
      valor: {
        type: DataTypes.DECIMAL,
        field: "valor",
      },
      descricao: {
        type: DataTypes.STRING,
        field: "descricao",
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        field: "ativo",
      },
    },
    {
      tableName: "veiculos",
      createdAt: false,
      updatedAt: false,
    }
  );

  Veiculo.associate = (models) => {
    models.Veiculo.hasMany(models.VeiculoFotos, {
      as: "fotos",
      foreignKey: "id_veiculo",
    });
    models.Veiculo.hasMany(models.VeiculoCombustivel, {
      as: "combustivel",
      foreignKey: "id_veiculo",
    });
  };

  sequelizePaginate.paginate(Veiculo);

  return Veiculo;
};
