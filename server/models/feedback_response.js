'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedback_response extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      feedback_response.hasOne(models.feedback, { foreignKey: 'response_id' })
      feedback_response.belongsTo(models.account, { foreignKey: 'officer' })
    }
  }
  feedback_response.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'feedback_response',
  });

  feedback_response.beforeCreate((instance, options) => { // Tạo ra ID có format
    // Get the current maximum number in the database
    return feedback_response.max('id', { raw: true })
      .then((maxNumber) => {
        const newNumber = maxNumber ? parseInt(maxNumber.substring(1)) + 1 : 1;
        instance.id = `RF${newNumber}`;
      });
  });
  return feedback_response;
};