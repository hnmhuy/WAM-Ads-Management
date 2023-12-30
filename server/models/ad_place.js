'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ad_place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ad_place.belongsTo(models.place, { foreignKey: 'place_id' })
      ad_place.belongsTo(models.category, { foreignKey: 'location_type', as: "locationType"})
      ad_place.belongsTo(models.category, { foreignKey: 'purpose', as: "purposeType" })
      ad_place.hasMany(models.ad_content, { foreignKey: 'ad_place_id' })
      ad_place.hasMany(models.update_request, { foreignKey: 'ad_place_id' })
    }
  }
  ad_place.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    capacity: DataTypes.INTEGER,
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    image1: DataTypes.TEXT,
    image2: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'ad_place',
  });

  // ad_place.beforeCreate((instance, options) => { // Tạo ra ID có format
  //   // Get the current maximum number in the database
  //   return ad_place.max('id', { raw: true })
  //     .then((maxNumber) => {
  //       const newNumber = maxNumber ? parseInt(maxNumber.substring(1)) + 1 : 1;
  //       instance.id = `P${newNumber}`;
  //     });
  // });
  return ad_place;
};