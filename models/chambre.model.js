module.exports = (sequelize, Sequelize) => {
const Chambre = sequelize.define('chambre', {
  numero: Sequelize.INTEGER,
  type: Sequelize.STRING,
  prix: Sequelize.FLOAT,
});

return Chambre;
};