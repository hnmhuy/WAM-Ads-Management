'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      area.hasMany(models.account, { foreignKey: 'delegation' })
      area.hasMany(models.place, { foreignKey: 'area_id' })
    }
  }
  area.init({
    parent_id: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'area',
  });
  return area;
};