"use strict";

module.exports = (sequelize, DataTypes) => {
  const Servicos = sequelize.define(
    "Servicos",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING,
        field: "nome",
      },
      logo: {
        type: DataTypes.STRING,
        field: "logo",
      },
    },
    {
      tableName: "servicos",
      createdAt: false,
      updatedAt: false,
    }
  );

  Servicos.associate = (models) => {
    models.Servicos.belongsTo(models.ServicosUtilizados, {
      as: "utilizacao",
      foreignKey: "id",
    });
    models.Servicos.hasMany(models.Credenciais, {
      as: "credentials",
      foreignKey: "id",
    });
  };

  return Servicos;
};
