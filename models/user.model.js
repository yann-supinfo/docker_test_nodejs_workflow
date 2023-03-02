module.exports = (sequelize, Sequelize) => {
const Client = sequelize.define('user', {
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