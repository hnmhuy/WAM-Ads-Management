'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback_responses', {
      response_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      img1: {
        type: Sequelize.STRING
      },
      img2: {
        type: Sequelize.STRING
      },
      response_time: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('feedback_responses');
  }
};