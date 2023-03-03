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
        console.error('Erreur lors de la synchronisation de la base de données : ', error);
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
            
            it("should throw an error when pwd is empty or not a string", async () => {
                await expect(User.createUser("test@test.com", "", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", [], "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
                await expect(User.createUser("test@test.com", {}, "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "should be a string not empty");
            });

            it("should throw an error when pwd is not valid", async () => {
                await expect(User.createUser("test@test.com", "password", "toto", "titi", "0606060606")).to.be.rejectedWith(Error, "invalid password");
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




    // describe("database validation", () => {
    //     it("should throw an error when user already exists in the database", () => {
    //         await expect(User.createUser("createuser@mail.com", "Passw0rd!", "toto", "titi", "0611111112")).to.be.rejectedWith("user already exist");
    //         await expect(User.createUser("createuser@mail2.com", "Passw0rd!", "toto", "titi", "0611111111")).to.be.rejectedWith("user already exist");
    //     });

    //     it("should throw an error if user Id does not exist", async () => {
    //         await expect(User.findById(100)).to.be.rejectedWith(Error, 'user Id does not exist');
    //     });
    // });

});

//     describe('findByEmail function', () => {

//         describe('Read Database User', () => {

//             before(async () => {
//                 // await db.sequelize.sync({force: true});
//                 // await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
//                 // await User.createUser("tototiti@email.com", "Passw0rd!", "toto", "titi", "0123456781");
//             });

//             it('should get the right user', async () => {
//                 const userSelected = await User.findByEmail("tototiti@email.com");
//                 expect(true).to.equal(bcrypt.compareSync("Passw0rd!", userSelected.password));
//                 expect(userSelected.nom).to.equal("toto");
//                 expect(userSelected.prenom).to.equal("titi");
//                 expect(userSelected.telephone).to.equal("0123456781");
//             });

//             it('throw error email does not exist', async () => {
//                 try {
//                     await User.findByEmail("failtototiti@email.com");
//                 } catch (error) {
//                     assert.strictEqual(error.message, 'User email does not exist');
//                 }
//                 try {
//                     await User.findByEmail("");
//                 } catch (error) {
//                     assert.strictEqual(error.message, 'User email does not exist');
//                 }
//             });

//         });

//         // describe('Table User', () => {
//         //     before(async () => {
//         //         await db.sequelize.drop();
//         //     });

//         //     it('throw error table user does not exist', async () => {
//         //         try {
//         //             await User.findByEmail("tototiti@email.com");
//         //         } catch (error) {
//         //             assert.strictEqual(error.message, 'users table does not exist');
//         //         }
//         //     });

//         //     after(async () => {
//         //         await db.sequelize.sync({force: true});
//         //     });
//         // });

//         describe('User Email', () => {

//             it('throw error email is not string', async () => {
//                 try {
//                     await User.findByEmail(2);
//                 } catch (error) {
//                     assert.strictEqual(error.message, 'should be a string');
//                 }
//             });

//             it('throw error Email is null', async () => {
//                 try {
//                     await User.findByEmail(null);
//                 } catch (error) {
//                     assert.strictEqual(error.message, 'email is null');
//                 }
//             });
//         });

//     });

//     describe('findByPhone function', () => {

//         describe('Read Database User', () => {

//             before(async () => {
//                 // await db.sequelize.sync({force: true});
//                 // await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
//                 // await User.createUser("tototiti@email.com", "Passw0rd!", "toto", "titi", "0123456781");
//             });

//             it('should get the right user', async () => {
//                 const userSelected = await User.findByPhone("0123456781");
//                 expect(userSelected.email).to.equal("tototiti@email.com");
//                 expect(true).to.equal(bcrypt.compareSync("Passw0rd!", userSelected.password));
//                 expect(userSelected.nom).to.equal("toto");
//                 expect(userSelected.prenom).to.equal("titi");
//             });

//             it('throw error phone does not exist', async () => {
//                 try {
//                     await User.findByPhone("1111111111");
//                 } catch (error) {
//                     assert.strictEqual(error.message, 'User phone does not exist');
//                 }
//                 try {
//                     await User.findByPhone("");
//                 } catch (error) {
//                     assert.strictEqual(error.message, 'User phone does not exist');
//                 }
//             });

//         });

//         // describe('Table User', () => {
//         //     before(async () => {
//         //         await db.sequelize.drop();
//         //     });

//         //     it('throw error table user does not exist', async () => {
//         //         try {
//         //             await User.findByPhone("0123456781");
//         //         } catch (error) {
//         //             assert.strictEqual(error.message, 'users table does not exist');
//         //         }
//         //     });

//         //     after(async () => {
//         //         await db.sequelize.sync({force: true});
//         //     });
//         // });

//         describe('User Phone', () => {

//             it('throw error phone is not string', async () => {
//                 try {
//                     await User.findByPhone(0101010101);
//                 } catch (error) {
//                     assert.strictEqual(error.message, 'should be a string');
//                 }
//             });

//             it('throw error phone is null', async () => {
//                 try {
//                     await User.findByPhone(null);
//                 } catch (error) {
//                     assert.strictEqual(error.message, 'phone is null');
//                 }
//             });
//         });

//     });
    

// });

after(async () => {
    // empty table user
});