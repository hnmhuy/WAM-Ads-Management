'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account.belongsTo(models.area)
      account.hasMany(models.feedback_response)
      account.hasMany(models.create_request)
      account.hasMany(models.update_request)
    }
  }
  account.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'account',
  });
  return account;
};