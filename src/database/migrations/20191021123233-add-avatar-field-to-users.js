'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'avatar_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',  // Para que caso o id do arquivo sofra alteração na tabela de files, esta alteração se reflita no campo avatar_id
        onDelete: 'SET NULL' // Para que caso o arquivo seja apagado na tabela de files este campo seja setado para NULL
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'avatar_id')
  }
};
