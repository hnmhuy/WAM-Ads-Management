'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class update_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      update_request.belongsTo(models.account);
      update_request.belongsTo(models.ad_place);
      update_request.belongsTo(models.ad_content);
    }
  }
  update_request.init({
    is_ad: DataTypes.BOOLEAN,
    request_data: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'update_request',
  });
  return update_request;
};