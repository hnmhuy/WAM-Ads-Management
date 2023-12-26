'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ad_content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ad_content.belongsTo(models.ad_place, { foreignKey: 'ad_place_id' })
      ad_content.hasMany(models.feedback, { foreignKey: 'ad_id' })
      ad_content.hasMany(models.create_request, { foreignKey: 'ad_id' })
      ad_content.hasMany(models.update_request, { foreignKey: 'ad_id' })
    }
  }
  ad_content.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    company_name: DataTypes.STRING,
    width: DataTypes.DECIMAL,
    height: DataTypes.DECIMAL,
    description: DataTypes.TEXT,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    status: DataTypes.STRING,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ad_content',
  });

  // ad_content.beforeCreate((instance, options) => { // Tạo ra ID có format
  //   // Get the current maximum number in the database
  //   return ad_content.max('id', { raw: true })
  //     .then((maxNumber) => {
  //       const newNumber = maxNumber ? parseInt(maxNumber.substring(1)) + 1 : 1;
  //       instance.id = `A${newNumber}`;
  //     });
  // });
  return ad_content;
};