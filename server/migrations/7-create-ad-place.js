'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ad_places', {
      ad_place_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      create_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      place_id: {
        type: Sequelize.STRING,
        references: {
          model: 'places',
          key: 'place_id'
        }
      },
      type_ad_id: {
        type: Sequelize.STRING,
        references: {
          model: 'categories',
          key: 'category_id'
        }
      },
      purpose_id: {
        type: Sequelize.STRING,
        references: {
          model: 'categories',
          key: 'category_id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ad_places');
  }
};