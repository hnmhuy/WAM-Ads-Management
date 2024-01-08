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
      update_request.belongsTo(models.ad_place, { foreignKey: 'ad_place_id' })
      update_request.belongsTo(models.ad_content, { foreignKey: 'ad_id' })
      update_request.belongsTo(models.account, { foreignKey: 'officer' })
    }
  }


  update_request.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    resquest_data: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'update_request',
  });

  return update_request;
};