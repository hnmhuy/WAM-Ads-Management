'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class create_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      create_request.belongsTo(models.ad_place)
      create_request.belongsTo(models.account)
      create_request.belongsTo(models.ad_content)
    }
  }
  create_request.init({
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'create_request',
  });
  return create_request;
};