"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Creating the Transfer table
    await queryInterface.createTable("transfers", {
      transactionHash: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      fromAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      toAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      crcAmount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      blockNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nftAmount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      nftMinted: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      processed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      cancelled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });

    // Creating the TreeData table
    await queryInterface.createTable("treeData", {
      nftIds: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      crcAmount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      steps: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Dropping the TreeData table
    await queryInterface.dropTable("treeData");

    // Dropping the Transfer table
    await queryInterface.dropTable("transfers");
  },
};
