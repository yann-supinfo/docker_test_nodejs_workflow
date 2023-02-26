module.exports = (sequelize, Sequelize) => {
const Client = sequelize.define('client', {
  nom: Sequelize.STRING,
  prenom: Sequelize.STRING,
  email: Sequelize.STRING,
  telephone: Sequelize.STRING,
});

return Client;
};