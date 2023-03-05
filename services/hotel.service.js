const db = require('../models');
const { Sequelize } = require('sequelize');

// for debugging only
const colors = require('colors');

const REGEXP_email = /^\S+@\S+\.\S+$/;
const REGEXP_phone = /^(0|\+33)[-. ]?[1-9]{1}([-. ]?[0-9]{2}){4}$/;

/* C.R.U.D Function Hotel */

    /* Create */
const createHotel = async (name, address, phone, description, email, price) => {

    try {
        isValidName(name);
        isValidAddress(address);
        isValidPhone(phone);
        isValidEmail(email);
        isValidPrice(price);
        isValidDescription(description);

        phone = formatPhoneNumber(phone);

        await isExistHotelTable();
        if(await isExistHotelEmail(0, email)) throw new Error('Hotel email already exist'.red);
        if(await isExistHotelPhone(0, phone)) throw new Error('Hotel phone already exist'.red);
        if(await isExistHotelAddress(0, address)) throw new Error('Hotel address already exist'.red);

        const Hotel = await db.hotel.create({
            name: name, 
            address: address,
            phone: phone,
            email: email,
            price: price, 
            description: description
        });

        console.log(`Hotel ${Hotel.name} has been successfully added`.green);
        return Hotel;

    } catch (err) {

        throw err.message;

    }
}

    /* Read */

        /* By Email */
const findById = async (id) => {
    
    try {

        isValidId(id);
        await isExistHotelTable();
        if(!await isExistHotelId(id)) throw new Error('hotel Id does not exist');
        const hotelSelected = await db.hotel.findByPk(id);

        console.log(`Hotel trouvé: ${hotelSelected.name}`.green);

        return hotelSelected;
                
    } catch(err) {

        throw err.message;

    }
}

        /* By Name */
const findByName = async (name) => {

    try {

        isValidName(name);
        await isExistHotelTable();
        if (!await isExistHotelName(name)) throw new Error('Hotel name does not exist'.red);
        
        const hotelSelected = await db.hotel.findAll({where: {name: name} });
        
        console.log(`Hotel trouvé: ${hotelSelected.name}`.green);
        return hotelSelected;
                
    } catch(err) {
        
        throw err.message;

    }
}

        /* By Address */
const findByAddress = async (address) => {

    try {

        isValidAddress(address);
        await isExistHotelTable();
        if (!await isExistHotelAddress(0, address)) throw new Error('Hotel address does not exist'.red);

        const hotelSelected = await db.hotel.findOne({where: {address: address} });
        
        console.log(`Hotel trouvé: ${hotelSelected.name}`.green);
        return hotelSelected;
                
    } catch(err) {

        throw err.message;

    }
}

    /* Update */
const updateHotel = async (id, hotelObj) => {
    
    try {

        isValidId(id);
        if(!await isExistHotelId(id)) throw new Error('hotel Id does not exist');
        isObj(hotelObj);

        await isExistHotelTable();  
        const hotel = await findById(id);
        
        if (hotelObj.hasOwnProperty('name')) {
            isValidName(hotelObj.name);
            hotel.name = hotelObj.name;
        }
        if (hotelObj.hasOwnProperty('address')) {
            isValidAddress(hotelObj.address);
            if (await isExistHotelAddress(id, hotelObj.address)) throw new Error('address already exist'.red);
            hotel.address = hotelObj.address;
        }
        if (hotelObj.hasOwnProperty('phone')) {
            isValidPhone(hotelObj.phone);
            if (await isExistHotelPhone(id, hotelObj.phone)) throw new Error('phone already exist'.red);
            hotel.phone = hotelObj.phone;
        }
        if (hotelObj.hasOwnProperty('description')) {
            isValidDescription(hotelObj.description);
            hotel.description = hotelObj.description;
        }
        if (hotelObj.hasOwnProperty('email')) {
            isValidEmail(hotelObj.email);
            if (await isExistHotelEmail(id, hotelObj.email)) throw new Error('email already exist'.red);
            hotel.email = hotelObj.email;
        }
        if (hotelObj.hasOwnProperty('price')) {
            isValidPrice(hotelObj.price);
            hotel.price = hotelObj.price;
        }

        await hotel.save();

        console.log(`Hotel with ID ${id} updated successfully`.green);

    } catch(err) {

        throw err;

    }

}
    /* Delete */
const deleteHotel = async (id) => {

    try {

        isValidId(id);
        await isExistHotelTable();
        if(!await isExistHotelId(id)) throw new Error('Hotel Id does not exist')

        db.hotel.destroy({
            where: { id: id }
        });

        console.log(`Hotel with ID ${id} removed successfully`.green);

    } catch(err) {

        throw err.message;

    }
}

/* Additionnal Function */
const formatPhoneNumber = (number) => {
    const strippedPrefix = number.replace(/^\+33/, '0');
    const digitsOnly = strippedPrefix.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
        return digitsOnly;
    }
    return null;
}

const isObj = (obj) => {
    if (typeof obj !== "object" && obj !== null) throw new Error('should be an object'.red);
}

const isExistHotelName = async (name) => {
    if (await db.hotel.count({ where: {name: name} }) > 0 ) return true;
    return false;
}

const isExistHotelAddress = async (id, address) => {
    if (await db.hotel.count({ where: {address: address, id: { [db.Sequelize.Op.ne]: id}} }) > 0 ) return true;
    return false;
}

const isExistHotelId = async (id) => {
    if (await db.hotel.count({ where: {id: id} }) > 0) return true;
    return false;
}

const isExistHotelPhone = async (id, phone) => {
    if (await db.hotel.count({ where: {phone: phone, id: { [db.Sequelize.Op.ne]: id}} }) > 0 ) return true;
    return false;
}

const isExistHotelEmail = async (id, email) => {
    if (await db.hotel.count({ where: {email: email, id: { [db.Sequelize.Op.ne]: id}}} ) > 0) return true;
    return false;
}

const isExistHotelTable = async () => {
    const queryInterface = db.sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    if(!tables.includes('hotels')) {
        throw new Error('hotels table does not exist'.red);
    }
    return true;
}

const isValidName = (name) => {
    if(name === null) throw new Error('name is null'.red);
    if(name.length > 50) throw new Error('name is more than 50 characters'.red);
    if(name === "" || typeof name !== "string") throw new Error('should be a string not empty'.red);
    if(isContainsSpecialCharacter(name)) throw new Error('should not contains specials characters'.red);
    return true;
}

const isValidAddress = (address) => {
    if(address === null) throw new Error('address is null'.red);
    if(address.length > 50) throw new Error('address is more than 50 characters'.red);
    if(address === "" || typeof address !== "string") throw new Error('should be a string not empty'.red);
    return true;
}

const isValidPrice = (price) => {
    if(price === null) throw new Error('price is null'.red);
    if(typeof price !== "number") throw new Error('should be an integer'.red);
    return true;
}

const isValidDescription = (description) => {
    if(description === null) throw new Error('description is null'.red);
    if(description.length > 100) throw new Error('description is more than 100 characters'.red);
    if(description === "" || typeof description !== "string") throw new Error('should be a string not empty'.red);
    return true;
}

const isValidId = (id) => {
    if(id === null) throw new Error('id is null'.red);
    if(typeof id !== "number") throw new Error('should be an integer'.red);
    return true;
}

const isValidEmail = (email) => {
    if(email === null) throw new Error('email is null'.red);
    if(email.length > 50) throw new Error('email is more than 50 characters'.red);
    if(email === "" || typeof email !== "string") throw new Error('should be a string not empty'.red);
    if(!REGEXP_email.test(email)) throw new Error('invalid email'.red);
    return true;
}

const isValidPhone = (phone) => {
    if(phone === null) throw new Error('phone is null'.red);
    if(phone === "" || typeof phone !== "string") throw new Error('should be a string not empty'.red);
    if(!REGEXP_phone.test(phone)) throw new Error('invalid phone'.red);
    return true;
};

const isContainsSpecialCharacter = (string) => {
    if(/[^a-zA-Z0-9\s]/.test(string)) return true;
    return false;
}

/* Exports */
module.exports = {
    createHotel,
    findById,
    findByName,
    findByAddress,
    updateHotel,
    deleteHotel
}

// const isContainsLowercase = (string) => {
//     if(!/[a-z]/.test(string)) throw new Error('should contains a lowercase'.red);
// }

// const isContainsUppercase = (string) => {
//     if(!/[A-Z]/.test(string)) throw new Error('should contains a uppercase'.red);
// }

// const isContainsNumber = (string) => {
//     if(!/[0-9]/.test(string)) throw new Error('should contains a number'.red);
// }
