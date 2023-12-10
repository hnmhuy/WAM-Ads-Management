'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('areas', {
      aid: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING(4)
      },
      parent_id: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      create_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      modified_time: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('areas');
  }
};