'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('create_requests', {
      request_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      new_instance_id: {
        type: Sequelize.STRING,
        references: {
          model: 'ad_places',
          key: 'ad_place_id'
        },
        references: {
          model: 'ad_contents',
          key: 'ad_id'
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
    await queryInterface.dropTable('create_requests');
  }
};