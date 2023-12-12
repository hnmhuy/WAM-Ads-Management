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
      ad_place.belongsTo(models.place)
      ad_place.hasMany(models.ad_content)
      ad_place.hasMany(models.update_request)
      ad_place.hasMany(models.create_request)
      ad_place.belongsTo(models.category)
    }
  }
  ad_place.init({
    capacity: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ad_place',
  });
  return ad_place;
};