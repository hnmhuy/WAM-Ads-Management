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
      ad_content.belongsTo(models.ad_place)
      ad_content.hasMany(models.feedback)
      ad_content.hasMany(models.update_request)
      ad_content.hasMany(models.create_request)
    }
  }
  ad_content.init({
    company_name: DataTypes.STRING,
    width: DataTypes.FLOAT,
    height: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ad_content',
  });
  return ad_content;
};