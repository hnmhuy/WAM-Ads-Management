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
      create_request.belongsTo(models.account, { foreignKey: 'officer' })
      create_request.belongsTo(models.ad_content, { foreignKey: 'ad_id' })
    }
  }
  create_request.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'create_request',
  });
  create_request.beforeCreate((instance, options) => { // Tạo ra ID có format
    // Get the current maximum number in the database
    return create_request.max('id', { raw: true })
      .then((maxNumber) => {
        const newNumber = maxNumber ? parseInt(maxNumber.substring(1)) + 1 : 1;
        instance.id = `RN${newNumber}`;
      });
  });
  return create_request;
};