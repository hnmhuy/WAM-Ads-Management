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
      feedback.belongsTo(models.place);
      feedback.belongsTo(models.ad_content);
      feedback.hasOne(models.feedback_response)
    }
  }
  feedback.init({
    type: DataTypes.TEXT,
    is_ad_feedback: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: DataTypes.STRING,
    record_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'feedback',
  });
  return feedback;
};