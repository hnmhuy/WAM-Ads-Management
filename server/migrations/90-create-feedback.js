'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedbacks', {
      feedback_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.TEXT
      },
      is_ad_feedback: {
        type: Sequelize.BOOLEAN
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      record_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      instance_id: {
        type: Sequelize.STRING,
        references: {
          model: 'places',
          key: 'place_id'
        },
        references: {
          model: 'ad_contents',
          key: 'ad_id'
        }
      },
      response_id: {
        type: Sequelize.STRING,
        references: {
          model: 'feedback_responses',
          key: 'response_id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('feedbacks');
  }
};