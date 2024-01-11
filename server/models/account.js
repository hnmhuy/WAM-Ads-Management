'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account.belongsTo(models.area, { foreignKey: 'delegation' })
      account.hasMany(models.feedback_response, { foreignKey: 'officer' })
      account.hasMany(models.create_request, { foreignKey: 'officer' })
      account.hasMany(models.update_request, { foreignKey: 'officer' })
    }
  }
  account.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    status: {
      type: DataTypes.STRING, // active and blocked
      defaultValue: 'active'
    },
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    dob: DataTypes.DATE,
    areaLevel: DataTypes.INTEGER, // 0: Sở, 1: Quận, 2: Phường
    bindAccount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'account',
  });

  // account.beforeCreate((instance, options) => { // Tạo ra ID có format
  //   // Get the current maximum number in the database
  //   return account.max('id', { raw: true })
  //     .then((maxNumber) => {
  //       const newNumber = maxNumber ? parseInt(maxNumber.substring(1)) + 1 : 1;
  //       instance.id = `U${newNumber}`;
  //     });
  // });
  return account;
};

