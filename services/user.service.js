const db = require('../models');
const { Sequelize } = require('sequelize');
const bcrypt = require("bcryptjs");



const REGEXP_email = /^\S+@\S+\.\S+$/;
const REGEXP_name = /^[a-zA-Z]+$/;
const REGEXP_phone = /^(0|\+33)[-. ]?[1-9]{1}([-. ]?[0-9]{2}){4}$/;
const REGEXP_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

// create
const createUser = async (mail, pwd, lastname, firstname, phone) => {

    if(mail === null) throw new Error('mail is null');
    if(mail === "" || typeof mail !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_email.test(mail)) throw new Error('invalid email');

    if(lastname === null) throw new Error('lastname is null');
    if(lastname === "" || typeof lastname !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_name.test(lastname)) throw new Error('invalid lastname');

    if(firstname === null) throw new Error('firstname is null');
    if(firstname === "" || typeof firstname !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_name.test(firstname)) throw new Error('invalid firstname');

    if(phone === null) throw new Error('phone is null');
    if(phone === "" || typeof phone !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_phone.test(phone)) throw new Error('invalid phone');

    if(pwd === null) throw new Error('password is null');
    if(!REGEXP_password.test(pwd)) throw new Error('invalid password. It should contain at least : \n- 1 uppercase\n- 1 lowercase\n- 1 special character\n- 1 number\n- 7 characters');

    phone = formatPhoneNumber(phone);

    try {
        const queryInterface = db.sequelize.getQueryInterface();
        const tables = await queryInterface.showAllTables();

        if(!tables.includes('users')) {
            throw new Error('users table does not exist');
        }
 
        if(await db.user.findOne({ where: {email: mail} }) !== null || await db.user.findOne({ where: {telephone: phone} }) !== null) throw new Error('user already exist');
 
        const User = await db.user.create({
            email: mail,
            password: bcrypt.hashSync(pwd, 8),
            nom: lastname,
            prenom: firstname,
            telephone: phone, 
        });
        console.log(`User ${User.nom} ${User.prenom} has been successfully added`);
    } catch (err) {

    }

}

const formatPhoneNumber = (number) => {
    const strippedPrefix = number.replace(/^\+33/, '0');
    const digitsOnly = strippedPrefix.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
        return digitsOnly;
    }
    return null;
}

module.exports = {
    createUser,
    formatPhoneNumber,
}