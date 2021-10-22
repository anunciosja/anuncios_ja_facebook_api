"use strict";

const sequelizePaginate = require("sequelize-paginate");

module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define(
    "Login",
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
        primaryKey: false,
        autoIncrement: false,
      },
      email: {
        type: DataTypes.STRING,
        field: "email",
      },
      password: {
        type: DataTypes.STRING,
        field: "password",
      },
      salt: {
        type: DataTypes.STRING,
        field: "salt",
      },
      ativo: {
        type: DataTypes.BOOLEAN,
        field: "ativo",
      },
      foto: {
        type: DataTypes.STRING,
        field: "foto",
      },
      nivel: {
        type: DataTypes.INTEGER,
        field: "nivel",
      },
      id_cliente: {
        type: DataTypes.INTEGER,
        field: "id_cliente",
      },
    },
    {
      tableName: "login",
      createdAt: false,
      updatedAt: false,
    }
  );

  Login.associate = (models) => {
    models.Login.belongsTo(models.Cliente, {
      as: "cliente",
      foreignKey: "id",
    });
  };

  sequelizePaginate.paginate(Login);

  return Login;
};
