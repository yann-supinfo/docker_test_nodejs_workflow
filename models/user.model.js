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
  nom: {
    type: Sequelize.STRING
  },
  prenom: {
    type: Sequelize.STRING
  },
  telephone: {
    type: Sequelize.STRING
  }
});

return Client;
};