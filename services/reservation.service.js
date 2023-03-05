const db = require('../models');
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");


// for debugging only
const colors = require('colors');

/* C.R.U.D Function Hotel */

    /* Create */
const createReservation = async (checkin, checkout, numberPeople, hotelId, userId) => {
    
    try {

        isValidDate(checkin);
        isValidDate(checkout);
        if(checkout < checkin) throw new Error('checkout must be after checkin'.red);
        isValidId(hotelId);
        isValidId(userId);
        await isExistHotelTable();
        await isExistUserTable();
        await isExistReservationTable();
        await isExistHotelId(hotelId);
        await isExistUserId(userId);
        isValidNumberPeople(numberPeople);

        if(await hasReservation(userId, checkin, checkout)) throw new Error('User already has a reservation for this period'.red);
        const oneDayMs = 24 * 60 * 60 * 1000;
        const diffMs = checkout.getTime() - checkin.getTime();
        const numberNight = Math.ceil(diffMs / oneDayMs);

        const reservation = await db.reservation.create({
          userId: userId,
          hotelId: hotelId,
          checkin: checkin,
          checkout: checkout,
          numberPeople: numberPeople,
          price : getPriceTrip(hotelId, numberNight) * numberPeople,
        });

        console.log(`The reservation from ${checkin} to ${checkout} has been successfully added`.green);
        return reservation;

      } catch (err) {

        throw err.message;

      }
}

    /* Read */

        /* By Id */
const findById = async (id) => {
    try {
        isValidId(id);
        await isExistReservationTable();

        if(!await isExistReservationId(id)) throw new Error('reservation Id does not exist'.red);

        const reservationSelected = await db.reservation.findByPk(id);

        console.log(`Reservation trouvée : ${reservationSelected.checkin} ${reservationSelected.checkout}`.green);
        return reservationSelected;
                
    } catch(err) {
        throw err.message;
    }
}

        /* By Hotel Id */
const findByHotel = async (hotelId) => {
    try {
        isValidId(hotelId);
        await isExistReservationTable();

        if(!await isExistHotelId(id)) throw new Error('hotel Id does not exist'.red);

        const reservationSelected = await db.reservation.findAll({where: {hotelId: hotelId} });

        console.log(`Reservation trouvée pour l'hotel ${hotelId}`.green);
        return reservationSelected;
                
    } catch(err) {
        throw err.message;
    }
}

        /* By User Id */
const findByUser = async (userId) => {
    try {
        isValidId(userId);
        await isExistReservationTable();

        if(!await isExistUserId(id)) throw new Error('user Id does not exist'.red);

        const reservationSelected = await db.reservation.findAll({where: {userId: userId} });

        console.log(`Reservation trouvée pour l'utilisateur ${hotelId}`.green);
        return reservationSelected;
                
    } catch(err) {
        throw err.message;
    }
}

    /* Update */
const updateReservation = async (id, reservationObj) => {
    // at least hotelId is mandatory !
    try {
        isValidId(id);
        isValidId(reservation.hotelId);
        isObj(reservationObj);

        await isExistReservationTable();
        await isExistHotelTable();
        if(!await isExistReservationId(id)) throw new Error('reservation Id does not exist'.red);
        if(!await isExistReservationId(id)) throw new Error('reservation Id does not exist'.red);
        let updatePrice = false;
        let checkinMs;
        let checkoutMs;
        let nbPeople;
        const reservation = await findById(id);
          
        if (reservationObj.hasOwnProperty('checkin')) {
            isValidDate(reservationObj.checkin);
            reservation.checkin = reservationObj.checkin;
            updatePrice = true;
            checkinMs = reservationObj.checkin.getTime();
        } else {
            checkinMs = reservation.checkin;
        }
        if (reservationObj.hasOwnProperty('checkout')) {
            isValidDate(reservationObj.checkout);
            reservation.checkout = reservationObj.checkout;
            updatePrice = true;
            checkoutMs = reservationObj.checkout.getTime();
        } else {
            checkoutMs = reservation.checkout;
        }
        if (reservationObj.hasOwnProperty('numberPeople')) {
            isValidNumberPeople(reservationObj.numberPeople);
            reservation.numberPeople = reservationObj.numberPeople;
            updatePrice = true;
            nbPeople = reservationObj.numberPeople;
        } else {
            nbPeople = reservation.numberPeople;
        }

        if(updatePrice) {
            const oneDayMs = 24 * 60 * 60 * 1000;
            const diffMs = checkoutMs - checkinMs;
            const numberNight = Math.ceil(diffMs / oneDayMs);
            reservation.price = getPriceTrip(hotelId, numberNight) * nbPeople;
        }

        await reservation.save();

        console.log(`Reservation with ID ${id} updated successfully`.green);
    } catch(err) {
        throw err.message;
    }

}
    /* Delete */
const deleteReservation = async (id) => {
    try {

        isValidId(id);
        await isExistReservationTable();
        if(!await isExistReservationId(id)) throw new Error('reservation Id does not exist')

        db.reservation.destroy({
            where: { id: id }
        });

        console.log(`Reservation with ID ${id} removed successfully`.green);

    } catch(err) {

        throw err.message;

    }
}

/* Additionnal Function */
const hasReservation = async (userId, checkin, checkout) => {
    const reservation = await db.reservation.findAll({
        where: {
            userId: userId,
            [Op.or]: [
                { startDate: { [Op.between]: [startDate, endDate] } },
                { endDate: { [Op.between]: [startDate, endDate] } },
                { [Op.and]: [ 
                    { startDate: { [Op.lte]: startDate } },
                    { endDate: { [Op.gte]: endDate } } ] 
                }
            ]
        }
    });
    if(reservations.length > 0) return true;
    return false;
}

const getPriceTrip = async (hotelId, numberNight) => {
    const hotel = await db.hotel.findByPk(hotelId);
    return numberNight * hotel.price;
}

const isObj = (obj) => {
    if (typeof obj !== "object" && obj !== null) throw new Error('should be an object'.red);
}

const isExistReservationId = async (id) => {
    if (await db.reservation.count({ where: {id: id} }) > 0) return true;
    return false;
}

const isExistHotelId = async (id) => {
    if (await db.hotel.count({ where: {id: id} }) > 0) return true;
    return false;
}

const isExistUserId = async (id) => {
    if (await db.user.count({ where: {id: id} }) > 0) return true;
    return false;
}

const isExistReservationTable = async () => {
    const queryInterface = db.sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    if(!tables.includes('reservations')) {
        throw new Error('reservations table does not exist'.red);
    }
    return true;
}

const isExistUserTable = async () => {
    const queryInterface = db.sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    if(!tables.includes('users')) {
        throw new Error('users table does not exist'.red);
    }
    return true;
}

const isExistHotelTable = async () => {
    const queryInterface = db.sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    if(!tables.includes('hotels')) {
        throw new Error('hotels table does not exist'.red);
    }
    return true;
}

const isValidDate = (date) => {
    if(date === null) throw new Error('date is null'.red);
    console.log(typeof date);
    if(!date instanceof Date && isNaN(date.valueOf())) throw new Error('should be a date object'.red);
    if(date < new Date()) throw new Error('can not be a past date'.red);
    return true;
}

const isValidId = (id) => {
    if(id === null) throw new Error('id is null'.red);
    if(typeof id !== "number") throw new Error('should be an integer'.red);
    return true;
}

const isValidNumberPeople = (number) => {
    if(number === null) throw new Error('number of people is null'.red);
    if(typeof number !== "number") throw new Error('should be an integer'.red);
    return true;
}

/* Exports */
module.exports = {
    createReservation,
    findById,
    findByHotel,
    findByUser,
    updateReservation,
    deleteReservation
}