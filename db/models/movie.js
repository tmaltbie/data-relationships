'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Movie extends Sequelize.Model {}
  Movie.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    releaseYear: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, { sequelize });

  Movie.associate = (models) => {
    Movie.belongsTo(models.Person, {
      as: 'director', // alias
      foreignKey: {
        fieldName: 'directorPersonId',
        field: 'directorPersonId',
        allowNull: false,
      },
      /**
        * Adding this option configures the database
        * to delete any rows in the Movies table when
        * a referenced row in the People table is deleted.
        */
      onDelete: 'cascade',
    });
    Movie.belongsToMany(models.Person, {
      as: 'actors',
      through: 'MovieActors',
      foreignKey: 'movieId', // associate with Person
      otherKey: 'personId',
    });
  };

  return Movie;
};
