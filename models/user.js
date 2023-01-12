'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type:DataTypes.STRING,
      validate:{isEmail:{msg:'format email tidak valid!'},notEmpty:{msg:'Email Harus Diisi!'}}
    },
    password: {
      type:DataTypes.STRING,
      validate:{notEmpty:{msg:'Password Harus Diisi!'}}
    },
    isAdmin: DataTypes.BOOLEAN
  }, {
    hooks:{
      beforeCreate(user,option){
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(user.password,salt);
        user.password = hash
        user.isAdmin = false
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};