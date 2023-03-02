const db = require('../models');
const { Sequelize } = require('sequelize');
const bcrypt = require("bcryptjs");

const REGEXP_email = /^\S+@\S+\.\S+$/;
const REGEXP_name = /^[a-zA-Z]+$/;
const REGEXP_phone = /^(0|\+33)[-. ]?[1-9]{1}([-. ]?[0-9]{2}){4}$/;
const REGEXP_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

/* C.R.U.D Function User */

    /* Create */

const createTableUser = async () => {
    await  db.sequelize.sync({force:true})
}

const userSync = async () => {
 //  await  db.user.sync()
}

const dropUserTable = async () => {
    await db.sequelize.drop();
}

const cleanUser = async () => {
    await db.user.destroy({
         where: {},
         truncate: true
       })
 }
 

const createUser = async (mail, pwd, lastname, firstname, phone) => {

    if(mail === null) throw new Error('mail is null');
    if(mail.length > 50) throw new Error('mail is more than 50 characters');
    if(mail === "" || typeof mail !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_email.test(mail)) throw new Error('invalid email');

    if(lastname === null) throw new Error('lastname is null');
    if(lastname.length > 50) throw new Error('lastname is more than 50 characters');
    if(lastname === "" || typeof lastname !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_name.test(lastname)) throw new Error('invalid lastname');

    if(firstname === null) throw new Error('firstname is null');
    if(firstname.length > 50) throw new Error('firstname is more than 50 characters');
    if(firstname === "" || typeof firstname !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_name.test(firstname)) throw new Error('invalid firstname');

    if(phone === null) throw new Error('phone is null');
    if(phone === "" || typeof phone !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_phone.test(phone)) throw new Error('invalid phone');

    if(pwd === null) throw new Error('password is null');
    if(pwd.length > 50) throw new Error('password is more than 50 characters');
    if(!REGEXP_password.test(pwd)) throw new Error('invalid password. It should contain at least : \n- 1 uppercase\n- 1 lowercase\n- 1 special character\n- 1 number\n- 7 characters');

    phone = formatPhoneNumber(phone);
    let encryptedPassword = bcrypt.hashSync(pwd, 8);

    try {
        const queryInterface = await db.sequelize.getQueryInterface();
        const tables = await queryInterface.showAllTables();

        if(!tables.includes('users')) {
            throw new Error('users table does not exist');
        }

        if(await db.user.findOne({ where: {email: mail} }) !== null || await db.user.findOne({ where: {telephone: phone} }) !== null) throw new Error('user already exist');

        const User = await db.user.create({
            email: mail,
            password: encryptedPassword,
            nom: lastname,
            prenom: firstname,
            telephone: phone, 
        });
        console.log(`User ${User.nom} ${User.prenom} has been successfully added`);
    } catch (err) {
        console.log('//////////////////////////', err.message)
    }

}

    /* Read */
        /* By Id */
const findById = async (id) => {

    if(id === null) throw new Error('id is null');
    if(typeof id !== "number") throw new Error('should be an integer');

    try {

        const queryInterface = await db.sequelize.getQueryInterface();
        const tables = await queryInterface.showAllTables();

        if(!tables.includes('users')) {
            throw new Error('users table does not exist');
        }

        const userSelected = await db.user.findByPk(id);
        
        if (!userSelected) throw new Error('User Id does not exist');

        console.log(`Utilisateur trouvé: ${userSelected.nom} ${userSelected.prenom}`);
        return userSelected;
                
    } catch(err) {
        console.log('//////////////////////////', err.message)
    }
}
        /* By Email */
const findByEmail = async (mail) => {

    if(mail === null) throw new Error('email is null');
    if(typeof mail !== "string") throw new Error('should be a string');

    try {

        const queryInterface = await db.sequelize.getQueryInterface();
        const tables = await queryInterface.showAllTables();

        if(!tables.includes('users')) {
            throw new Error('users table does not exist');
        }

        const userSelected = await db.user.findOne({where: {email: mail} });
        
        if (!userSelected) throw new Error('User email does not exist');

        console.log(`Utilisateur trouvé: ${userSelected.nom} ${userSelected.prenom}`);
        return userSelected;
                
    } catch(err) {
        console.log('//////////////////////////', err.message)
    }
}
        /* By Phone number */
const findByPhone = async (phone) => {

    if(phone === null) throw new Error('phone is null');
    if(typeof phone !== "string") throw new Error('should be a string');

    phone = formatPhoneNumber(phone);

    try {

        const queryInterface = await db.sequelize.getQueryInterface();
        const tables = await queryInterface.showAllTables();

        if(!tables.includes('users')) {
            throw new Error('users table does not exist');
        }

        const userSelected = await db.user.findOne({where: {telephone: phone} });
        
        if (!userSelected) throw new Error('User phone does not exist');

        console.log(`Utilisateur trouvé: ${userSelected.nom} ${userSelected.prenom}`);
        return userSelected;
                
    } catch(err) {
        console.log('//////////////////////////', err.message)
    }
}

    /* Update */
// here

    /* Delete */
// here

/* Additionnal Function */
const formatPhoneNumber = (number) => {
    const strippedPrefix = number.replace(/^\+33/, '0');
    const digitsOnly = strippedPrefix.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
        return digitsOnly;
    }
    return null;
}

/* Exports */
module.exports = {
    createUser,
    findById,
    findByEmail,
    findByPhone,
    formatPhoneNumber,
    dropUserTable,
    cleanUser,
    userSync,
    createTableUser
}