'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
      Profile.hasMany(models.Comment)
      Profile.hasMany(models.Post)
    }
  }
  Profile.init({
    fullName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg:'Full Name is required!'}
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg:'Address is required!'}
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {msg:'Date of birth is required!'}
      }
    },
    UserId: DataTypes.INTEGER,
    img: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg:'Profile picture is required!'}
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};