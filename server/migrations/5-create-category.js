'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      category_id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.CHAR
      },
      icon: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      date_create: {
        allowNull: false,
        type: Sequelize.DATE
      },
      field_id: {
        type: Sequelize.STRING,
        references: {
          model: 'fields',
          key: 'field_id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};