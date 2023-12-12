'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      feedback.belongsTo(models.place, { foreignKey: 'place_id' })
      feedback.belongsTo(models.ad_content, { foreignKey: 'ad_id' })
      feedback.belongsTo(models.feedback_response, { foreignKey: 'response_id' })
    }
  }
  feedback.init({
    type: DataTypes.TEXT,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: DataTypes.STRING,
    content: DataTypes.STRING,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'feedback',
  });
  return feedback;
};