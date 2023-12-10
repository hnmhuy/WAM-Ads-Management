'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('update_requests', {
      request_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      is_ad: {
        type: Sequelize.BOOLEAN
      },
      request_data: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      instance_id: {
        type: Sequelize.STRING,
        references: {
          model: 'ad_contents',
          key: 'ad_id'
        },
        references: {
          model: 'ad_places',
          key: 'ad_place_id'
        }
      },
      officer: {
        type: Sequelize.STRING,
        references: {
          model: 'accounts',
          key: 'uid'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('update_requests');
  }
};