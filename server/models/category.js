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
      category.hasMany(models.feedback, { foreignKey: 'type'})
    }
  }
  category.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};