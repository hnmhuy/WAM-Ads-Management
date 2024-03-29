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
      feedback.belongsTo(models.category, { foreignKey: 'type'})
    }
  }
  feedback.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: "sent"
    },
    content: DataTypes.TEXT,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'feedback',
  });

  // feedback.beforeCreate((instance, options) => { // Tạo ra ID có format
  //   // Get the current maximum number in the database
  //   return feedback.max('id', { raw: true })
  //     .then((maxNumber) => {
  //       console.log(maxNumber);
  //       const newNumber = maxNumber ? parseInt(maxNumber.substring(1)) + 1 : 1;
  //       instance.id = `F${newNumber}`;
  //     });
  // });
  return feedback;
};