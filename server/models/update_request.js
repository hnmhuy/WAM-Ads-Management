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
      type: DataTypes.STRING,
      primaryKey: true
    },
    resquest_data: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'update_request',
  });

  update_request.beforeCreate((instance, options) => { // Tạo ra ID có format
    // Get the current maximum number in the database
    return update_request.max('id', { raw: true })
      .then((maxNumber) => {
        const newNumber = maxNumber ? parseInt(maxNumber.substring(1)) + 1 : 1;
        instance.id = `RU${newNumber}`;
      });
  });

  return update_request;
};