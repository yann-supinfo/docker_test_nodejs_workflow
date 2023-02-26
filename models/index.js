const Sequelize = require('sequelize');
const hotelSeed = require('./../seeders/hotel.seed');
require('dotenv').config()
// Create a new Sequelize instance
const sequelize = new Sequelize(
    'databases',
    'databases',
    'databases',
    {
      port: 32768,
      host: process.env.MYSQL_HOST,
      dialect: 'mysql'
    }
  );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.hotel = require("./hotel.model.js")(sequelize, Sequelize);
db.chambre = require("./chambre.model.js")(sequelize, Sequelize);
db.client = require("./client.model.js")(sequelize, Sequelize);
db.reservation = require("./reservation.model.js")(sequelize, Sequelize);


db.hotel.hasMany(db.reservation);
db.reservation.belongsTo(db.hotel);

db.client .hasMany(db.reservation);
db.reservation.belongsTo(db.client);

db.hotel.hasMany(db.chambre);
db.chambre.belongsTo(db.hotel);

/*db.sequelize.sync({ force: true }).then(() => {
    console.log('All models were synchronized successfully.');
  }).catch((error) => {
    console.error('An error occurred while synchronizing the models:', error);
  });*/

  (async () => {
    try {
        await db.sequelize.sync({ force: true });
      console.log(db.hotel, hotelSeed)
  //    await db.hotel.bulkCreate(hotelSeed.hotels, { include: [db.chambre] });
        await db.hotel.create({
            name: 'Hôtel de Paris',
            address: '5 rue de la Paix, Paris',
            phone: '060201821',
            email: 'hotel@email.fr'
        }).then(hotel => {
            db.chambre.bulkCreate([
            { numero: 101, type: 'Simple', prix: 100 ,hotelId: hotel.id },
            { numero: 102, type: 'Double',prix: 130  ,hotelId: hotel.id },
            { numero: 103, type: 'Double', prix: 140 ,hotelId: hotel.id }
            ]);
        });
        await db.hotel.create({
            name: 'Hôtel de Nice',
            address: '5 rue de la Paix, Nice',
            phone: '060201824',
            email: 'hotel2@email.fr',
            chambres: [
                { numero: 100, type: 'Simple', prix: 200},
                { numero: 101, type: 'Simple', prix: 200}
            ], 
            reservations: [
                { nb_personnes: 10 },
                { nb_personnes: 20}
            ]
            },    
            {
                include: [db.chambre, db.reservation]
            })
       const res1 = await db.reservation.findByPk(1);
       const res2 = await db.reservation.findByPk(2);
       const hot1 = await db.reservation.findByPk(1);
       res1.setHotel([hot1.id])
       res2.setHotel([hot1.id])          
      console.log('Données de graine chargées avec succès !');
    } catch (err) {
      console.error('Erreur lors du chargement des données de graine :', err);
    }
  })();

module.exports = db;