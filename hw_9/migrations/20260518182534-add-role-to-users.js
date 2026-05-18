"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("UsersList", "role", {
    type: Sequelize.STRING,
    allowNull: false,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("UsersList", "role");
}
