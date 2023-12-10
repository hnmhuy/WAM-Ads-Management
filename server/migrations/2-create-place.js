'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('places', {
      place_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      geometry: {
        type: Sequelize.STRING
      },
      address_formated: {
        type: Sequelize.STRING
      },
      area_id: {
        type: Sequelize.STRING(4),
        references: {
          model: 'areas',
          key: 'aid'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('places');
  }
};