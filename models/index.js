const Sequelize = require('sequelize');
const hotelSeed = require('./../seeders/hotel.seed');
require('dotenv').config()
// Create a new Sequelize instance
const sequelize = new Sequelize(
    'databases',
    'databases',
    'databases',
    {
      logging: false,
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





module.exports = db;