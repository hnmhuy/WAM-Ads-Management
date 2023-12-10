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
      feedback_response.belongsTo(models.account)
      feedback_response.belongsTo(models.feedback)
    }
  }
  feedback_response.init({
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'feedback_response',
  });
  return feedback_response;
};