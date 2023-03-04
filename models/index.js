const Sequelize = require('sequelize');
const hotelSeed = require('./../seeders/hotel.seed');
require('dotenv').config()
// Create a new Sequelize instance
const sequelize = new Sequelize(
    'databases',
    'databases',
    'databases',
    {
      port: process.env.MYSQL_PORT,
      host: process.env.MYSQL_HOST,
      dialect: 'mysql'
    }
  );

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.hotel = require("./hotel.model.js")(sequelize, Sequelize);

db.user = require("./user.model.js")(sequelize, Sequelize);
db.reservation = require("./reservation.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);

db.hotel.hasMany(db.reservation);
db.reservation.belongsTo(db.hotel);

db.user .hasMany(db.reservation);
db.reservation.belongsTo(db.user);



db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

/*db.sequelize.sync({ force: true }).then(() => {
    console.log('All models were synchronized successfully.');
  }).catch((error) => {
    console.error('An error occurred while synchronizing the models:', error);
  });*/

 /* (async () => {
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
       db.role.create({
        id: 1,
        name: "user"
      });
     
      db.role.create({
        id: 2,
        name: "moderator"
      });
     
      db.role.create({
        id: 3,
        name: "admin"
      });       
      console.log('Données de graine chargées avec succès !');
    } catch (err) {
      console.error('Erreur lors du chargement des données de graine :', err);
    }
  })();*/

module.exports = db;