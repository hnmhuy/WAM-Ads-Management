'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      category.belongsTo(models.field, { foreignKey: 'field_id' })
      category.hasMany(models.ad_place, { foreignKey: 'type_ad_id' })
      category.hasMany(models.ad_place, { foreignKey: 'purpose_id' })
    }
  }
  category.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'category',
  });
  category.beforeCreate((instance, options) => { // Tạo ra ID có format
    // Get the current maximum number in the database
    return category.max('id', { raw: true })
      .then((maxNumber) => {
        const newNumber = maxNumber ? parseInt(maxNumber.substring(1)) + 1 : 1;
        instance.id = `C${newNumber}`;
      });
  });
  return category;
};