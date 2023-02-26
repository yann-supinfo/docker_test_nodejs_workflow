module.exports = (sequelize, Sequelize) => {
const Reservation = sequelize.define('reservation', {
  check_in: Sequelize.DATE,
  check_out: Sequelize.DATE,
  nb_personnes: Sequelize.INTEGER,
});


return Reservation;
};