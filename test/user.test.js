const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.use(require('chai-as-promised'));
const User = require('../services/user.service')
const db = require('../models');
const bcrypt = require("bcryptjs");

before(async () => {
    try {
        await db.sequelize.sync({force: true});
        console.log('Base de données synchronisée avec succès.');
    } catch(err) {
        console.error('Erreur lors de la synchronisation de la base de données : ', err);
    }
});

describe('User', () => {

/**
 * CREATE USER TEST
 */
    describe('createUser function', () => {

        describe("mail validation", () => {
            it("should throw an error when mail is null", async () => {
                await expect(User.createUser(null, "Passw0rd!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "mail is null");
            });
        
            it("should throw an error when mail is more than 50 characters", async () => {
                await expect(User.createUser("test@test.com".repeat(10), "Passw0rd!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "mail is more than 50 characters");
            });
        
            it("should throw an error when mail is empty or not a string", async () => {
                await expect(User.createUser("", "Passw0rd!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser([], "Passw0rd!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser({}, "Passw0rd!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
            });
        
            it("should throw an error when mail is not a valid email address", async () => {
                await expect(User.createUser("test", "Passw0rd!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "invalid email");
            });
        
            it("should create a user when mail is valid", async () => {
                await expect(User.createUser("createuser@mail.com", "Passw0rd!", "toto", "titi", "0611111111")).to.not.be.rejected;
            });
        });

        describe("pwd validation", () => {
            it("should throw an error when pwd is null", async () => {
                await expect(User.createUser("test@test.com", null, "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "password is null");
            });
        
            it("should throw an error when pwd is more than 50 characters", async () => {
                await expect(User.createUser("test@test.com", "A".repeat(51), "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "password is more than 50 characters");
            });

            it("should throw an error when pwd is less than 7 characters", async () => {
                await expect(User.createUser("test@test.com", "A", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "password is less than 7 characters");
            });
            
            it("should throw an error when pwd is empty or not a string", async () => {
                await expect(User.createUser("test@test.com", "", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", [], "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", {}, "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
            });

            it("should throw an error when pwd is not valid", async () => {
                await expect(User.createUser("test@test.com", "PASSWORD1!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should contains a lowercase");
                await expect(User.createUser("test@test.com", "password1!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should contains a uppercase");
                await expect(User.createUser("test@test.com", "Password!", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should contains a number");
                await expect(User.createUser("test@test.com", "Password1", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should contains a special character");
            });
        
            it("should create a user when pwd is valid", async () => {
                await expect(User.createUser("createuser@pwd1.com", "Passw0rd!", "toto", "titi", "0622222222")).to.not.be.rejected;
                expect(db.user.findOne({where: {email: "createuser@pwd1.com"}})).to.not.equal("Passw0rd!");
            });

        });

        describe("lastname validation", () => {
            it("should throw an error when lastname is null", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", null, "titi", "0606060606")).to.be.rejectedWith(Error, "lastname is null");
            });
        
            it("should throw an error when lastname is more than 50 characters", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "t".repeat(51), "titi", "0606060606")).to.be.rejectedWith(Error, "lastname is more than 50 characters");
            });
        
            it("should throw an error when lastname is empty or not a string", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", "Passw0rd!", [], "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", "Passw0rd!", {}, "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
            });

            it("should throw an error when lastname is not valid", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto123", "titi", "0606060606")).to.be.rejectedWith(Error, "invalid lastname");
            });
        
            it("should create a user when lastname is valid", async () => {
                await expect(User.createUser("createuser@lastname.com", "Passw0rd!", "toto", "titi", "0633333333")).to.not.be.rejected;
            });
        });

        describe("firstname validation", () => {
            it("should throw an error when firstname is null", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", null, "0606060606")).to.be.rejectedWith(Error, "firstname is null");
            });
        
            it("should throw an error when firstname is more than 50 characters", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", "t".repeat(51), "0606060606")).to.be.rejectedWith(Error, "firstname is more than 50 characters");
            });

            it("should throw an error when firstname is empty or not a string", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", "", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", [], "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", {}, "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
            });
        
            it("should throw an error when firstname is not valid", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", "titi123", "0606060606")).to.be.rejectedWith(Error, "invalid firstname");
            });
        
            it("should create a user when firstname is valid", async () => {
                await expect(User.createUser("createuser@firstname.com", "Passw0rd!", "toto", "titi", "0644444444")).to.not.be.rejected;
            });
        });

        describe("phone validation", () => {
            it("should throw an error when phone is null", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", "titi", null)).to.be.rejectedWith(Error, "phone is null");
            });

            it("should throw an error when phone is empty or not a string", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", "titi", "")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", "titi", [])).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", "titi", {})).to.be.rejectedWith(Error, "should be a string not empty");
            });
        
            it("should throw an error when phone is not valid", async () => {
                await expect(User.createUser("test@test.com", "Passw0rd!", "toto", "titi", "+33606060606345")).to.be.rejectedWith(Error, "invalid phone");
            });
        
            it("should create a user when phone is valid", async () => {
                await expect(User.createUser("createuser@phone1.com", "Passw0rd!", "toto", "titi", "0123456780")).to.not.be.rejected;
                await expect(User.createUser("createuser@phone2.com", "Passw0rd!", "toto", "titi", "01 23 45 67 81")).to.not.be.rejected;
                await expect(User.createUser("createuser@phone3.com", "Passw0rd!", "toto", "titi", "01-23-45-67-82")).to.not.be.rejected;
                await expect(User.createUser("createuser@phone4.com", "Passw0rd!", "toto", "titi", "01.23.45.67.83")).to.not.be.rejected;
                await expect(User.createUser("createuser@phone5.com", "Passw0rd!", "toto", "titi", "+33123456784")).to.not.be.rejected;
                await expect(User.createUser("createuser@phone6.com", "Passw0rd!", "toto", "titi", "+33 1 23 45 67 85")).to.not.be.rejected;
                await expect(User.createUser("createuser@phone7.com", "Passw0rd!", "toto", "titi", "+33-1-23-45-67-86")).to.not.be.rejected;
                await expect(User.createUser("createuser@phone8.com", "Passw0rd!", "toto", "titi", "+33.1.23.45.67.87")).to.not.be.rejected;
            });
        });

    });

/**
 * FIND BY ID TEST
 */
    describe('findById function', () => {

        it("should throw an error if id is null", async () => {
            await expect(User.findById(null)).to.be.rejectedWith(Error, 'id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(User.findById("id")).to.be.rejectedWith(Error, 'should be an integer');
        });

        it("should return the user if found", async () => {
            const result = await User.findById(1);
            expect(result).to.have.property('id', 1);
            expect(result).to.have.property('email', "createuser@mail.com");
            expect(result).to.have.property('nom', "toto");
            expect(result).to.have.property('prenom', "titi");
            expect(result).to.have.property('telephone', "0611111111");
        });

    });

/**
 * FIND BY EMAIL TEST
 */
    describe('findByEmail function', () => {

        it("should throw an error if email is null", async () => {
            await expect(User.findByEmail(null)).to.be.rejectedWith(Error, 'email is null');
        });

        it("should throw an error if email is not a string", async () => {
            await expect(User.findByEmail(123)).to.be.rejectedWith(Error, 'should be a string');
        });

        it("should return the user if found", async () => {
            const result = await User.findByEmail("createuser@mail.com");
            expect(result).to.have.property('id', 1);
            expect(result).to.have.property('email', "createuser@mail.com");
            expect(result).to.have.property('nom', "toto");
            expect(result).to.have.property('prenom', "titi");
            expect(result).to.have.property('telephone', "0611111111");
        });

    });

/**
 * FIND BY PHONE TEST
 */
    describe('findByPhone function', () => {

        it("should throw an error if phone is null", async () => {
            await expect(User.findByPhone(null)).to.be.rejectedWith(Error, 'phone is null');
        });

        it("should throw an error if phone is not a string", async () => {
            await expect(User.findByPhone(0611111111)).to.be.rejectedWith(Error, 'should be a string');
        });

        it("should return the user if found", async () => {
            const result = await User.findByPhone("0611111111");
            expect(result).to.have.property('id', 1);
            expect(result).to.have.property('email', "createuser@mail.com");
            expect(result).to.have.property('nom', "toto");
            expect(result).to.have.property('prenom', "titi");
            expect(result).to.have.property('telephone', "0611111111");
        });

    });

/**
 * FIND BY LASTNAME TEST
 */
    describe('findByLastname function', () => {

        it("should throw an error if lastname is null", async () => {
            await expect(User.findByLastname(null)).to.be.rejectedWith(Error, 'lastname is null');
        });

        it("should throw an error if lastname is not a string", async () => {
            await expect(User.findByLastname(123)).to.be.rejectedWith(Error, 'should be a string');
        });

        it("should return the user if found", async () => {
            const resultList = await User.findByLastname("toto");
            expect(resultList).to.exist;
            expect(resultList).to.be.an('array');
            expect(resultList.every(user => user.nom === "toto")).to.be.true;
        });

    });

/**
 * FIND BY FIRSTNAME TEST
 */
    describe('findByFirstname function', () => {

        it("should throw an error if firstname is null", async () => {
            await expect(User.findByFirstname(null)).to.be.rejectedWith(Error, 'firstname is null');
        });

        it("should throw an error if firstname is not a string", async () => {
            await expect(User.findByFirstname(123)).to.be.rejectedWith(Error, 'should be a string');
        });

        it("should return the user if found", async () => {
            const resultList = await User.findByFirstname("titi");
            expect(resultList).to.exist;
            expect(resultList).to.be.an('array');
            expect(resultList.every(user => user.prenom === "titi")).to.be.true;
        });

    });

/**
 * UPDATE USER TEST
 */
    describe('UpdateUser function', () => {

        it("should throw an error if id is null", async () => {
            await expect(User.updateUser(null, {})).to.be.rejectedWith(Error, 'id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(User.updateUser("1", {})).to.be.rejectedWith(Error, 'should be an integer');
        });

        it("should throw an error if email is already used", async () => {
            await expect(User.updateUser(1, {email: "createuser@phone1.com"})).to.be.rejectedWith(Error, 'email already exist');
        });

        it("should throw an error if phone is already used", async () => {
            await expect(User.updateUser(1, {telephone: "0123456780"})).to.be.rejectedWith(Error, 'phone already exist');
        });

        it("should update the user", async () => {
            await expect(User.updateUser(1, {nom: "updated"})).to.not.be.rejected;
            const result = await User.findById(1);
            expect(result).to.have.property('nom', 'updated');

            await expect(User.updateUser(2, {nom: "updated", prenom: "test"})).to.not.be.rejected;
            const result2 = await User.findById(2);
            expect(result2).to.have.property('nom', 'updated');
            expect(result2).to.have.property('prenom', 'test');
        });

    });

/**
 * DELETE USER TEST
 */
    describe('DeleteUser function', () => {

        it("should throw an error if id is null", async () => {
            await expect(User.deleteUser(null, {})).to.be.rejectedWith(Error, 'id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(User.deleteUser("1", {})).to.be.rejectedWith(Error, 'should be an integer');
        });

        it("should delete the user", async () => {
            await expect(User.deleteUser(1)).to.not.be.rejected;
            await expect(User.findById(1)).to.be.rejectedWith(Error, 'user Id does not exist');
        });

    });

    describe("database validation", () => {
        it("should throw an error when user already exists in the database", async () => {
            await expect(User.createUser("createuser@phone1.com", "Passw0rd!", "toto", "titi", "0611111112")).to.be.rejectedWith("email already exist");
            await expect(User.createUser("createuser@phone150.com", "Passw0rd!", "toto", "titi", "0123456780")).to.be.rejectedWith("phone already exist");
        });

        it("should throw an error if user Id does not exist", async () => {
            await expect(User.findById(100)).to.be.rejectedWith(Error, 'user Id does not exist');
        });
    });

});

after(async () => {
    try {
        await db.sequelize.sync({force: true});
        console.log('Toutes les tables ont été vidées avec succès.');
    } catch(err) {
        console.error('Erreur lors de la synchronisation de la base de données : ', err);
    }
});