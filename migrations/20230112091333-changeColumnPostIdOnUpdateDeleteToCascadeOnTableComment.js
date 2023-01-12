'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.changeColumn('Comments', 'PostId', {
      type: Sequelize.INTEGER,
      references: {
        key: 'id',
        model: 'Posts'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  },

  down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.changeColumn('Comments', 'PostId', {
      type: Sequelize.INTEGER,
      references: {
        key: 'id',
        model: 'Posts'
      }
    }) 
  }
};
