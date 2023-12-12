'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      place.belongsTo(models.area)
      place.hasMany(models.ad_place)
      place.hasMany(models.feedback)
      // place.hasMany(models.feedback)
    }
  }
  place.init({
    geometry: DataTypes.STRING,
    address_formated: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'place',
  });
  return place;
};