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
      place.belongsTo(models.area, { foreignKey: 'area_id' })
      place.hasMany(models.ad_place, { foreignKey: 'place_id' })
      place.hasMany(models.feedback, { foreignKey: 'place_id' })
    }
  }
  place.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    geometry: DataTypes.TEXT,
    address_formated: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'place',
  });
  return place;
};