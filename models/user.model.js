module.exports = (sequelize, Sequelize) => {
const Client = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  nom: Sequelize.STRING,
  prenom: Sequelize.STRING,
  telephone: Sequelize.STRING
});

return Client;
};