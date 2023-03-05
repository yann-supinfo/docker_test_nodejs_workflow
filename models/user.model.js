module.exports = (sequelize, Sequelize) => {
const Client = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nom: Sequelize.STRING,
  prenom: Sequelize.STRING,
  telephone: Sequelize.STRING
});

return Client;
};