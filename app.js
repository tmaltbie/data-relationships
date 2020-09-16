'use strict';

const { sequelize, models } = require('./db');

// Get references to our models.
const { Person, Movie } = models;

// Define variables for the people and movies.
// NOTE: We'll use these variables to assist with the creation
// of our related data after we've defined the relationships
// (or associations) between our models.
let bradBird;
let vinDiesel;
let eliMarienthal;
let craigTNelson;
let hollyHunter;
let theIronGiant;
let theIncredibles;
let gladiator;
let russellCrowe;
let ridleyScott;
let joaquinPhoenix;
let sigourneyWeaver;
let tomHanks;
let mattDamon;
let stevenSpielberg;
let alien;
let savingPrivateRyan;


console.log('Testing the connection to the database...');

(async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log('Connection to the database successful!');

    // Sync the models
    console.log('Synchronizing the models with the database...');
    await sequelize.sync({ force: true });

    // Add People to the Database
    console.log('Adding people to the database...');
    const peopleInstances = await Promise.all([
      Person.create({
        firstName: 'Brad',
        lastName: 'Bird',
      }),
      Person.create({
        firstName: 'Vin',
        lastName: 'Diesel',
      }),
      Person.create({
        firstName: 'Eli',
        lastName: 'Marienthal',
      }),
      Person.create({
        firstName: 'Craig T.',
        lastName: 'Nelson',
      }),
      Person.create({
        firstName: 'Holly',
        lastName: 'Hunter',
      }),
      Person.create({
        firstName: 'Russell',
        lastName: 'Crowe',
      }),
      Person.create({
        firstName: 'Ridley',
        lastName: 'Scott',
      }),
      Person.create({
        firstName: 'Joaquin',
        lastName: 'Phoenix',
      }),
      Person.create({
        firstName: 'Sigourney',
        lastName: 'Weaver',
      }),
      Person.create({
        firstName: 'Tom',
        lastName: 'Hanks',
      }),
      Person.create({
        firstName: 'Matt',
        lastName: 'Damon',
      }),
      Person.create({
        firstName: 'Steven',
        lastName: 'Spielberg',
      }),
    ]);
    console.log(JSON.stringify(peopleInstances, null, 2));
    // Update the global variables for the people instances
    [bradBird,
      vinDiesel,
      eliMarienthal,
      craigTNelson,
      hollyHunter,
      russellCrowe,
      ridleyScott,
      joaquinPhoenix,
      sigourneyWeaver,
      tomHanks,
      mattDamon,
      stevenSpielberg] = peopleInstances;


    // Add Movies to the Database
    console.log('Adding movies to the database...');
    const movieInstances = await Promise.all([
      Movie.create({
        title: 'Alien',
        releaseYear: 1979,
        directorPersonId: ridleyScott.id,
      }),
      Movie.create({
        title: 'Saving Private Ryan',
        releaseYear: 1998,
        directorPersonId: stevenSpielberg.id,
      }),
      Movie.create({
        title: 'The Iron Giant',
        releaseYear: 1999,
        directorPersonId: bradBird.id,
      }),
      Movie.create({
        title: 'Gladiator',
        releaseYear: 2000,
        directorPersonId: ridleyScott.id,
      }),
      Movie.create({
        title: 'The Incredibles',
        releaseYear: 2004,
        directorPersonId: bradBird.id,
      }),
    ]);
    console.log(JSON.stringify(movieInstances, null, 2));

    // update the global variables for the movie instances
    [theIronGiant, theIncredibles, alien, savingPrivateRyan, gladiator] = movieInstances;

    const p1c = theIronGiant.addActors([
      vinDiesel,
      eliMarienthal,
    ]);

    const p2 = theIncredibles.addActors([
      craigTNelson,
      hollyHunter,
    ]);

    const p3 = savingPrivateRyan.addActors([
      tomHanks,
      mattDamon,
    ]);

    const actors = await Promise.all([
      p1c,
      p2,
      p3,
    ]);
    console.log(JSON.stringify(actors, null, 2));

    // Retrieve movies
    const movies = await Movie.findAll({
      include: [
        {
          model: Person,
          as: 'director',
        },
        {
          model: Person,
          as: 'actors',
          // attributes: ['firstName, 'lastName'],
          through: {
            // this removes the through model properties from being included
            attributes: [],
          },
        },
      ],
    });
    console.log(movies.map(movie => movie.get({ plain: true })));

    // Retrieve people
    const people = await Person.findAll({
      include: [
        {
          model: Movie,
          as: 'director',
          attributes: ['id', 'title', 'releaseYear'],
        },
        {
          model: Movie,
          as: 'actor',
          attributes: ['id', 'title', 'releaseYear'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    // console.log(people.map(person => person.get({ plain: true })));
    /** When converting an instance or collection of instances to JSON,
    calling .get({ plain: true}) returns the same as calling .toJSON() –
    a plain object with just the model attributes and values. */
    console.log(JSON.stringify(people, null, 2));

    process.exit();
  // The process.exit() method instructs Node.js to terminate the process (or program) immediately.
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      console.error(error); // just log the error
    }
  }
})();
