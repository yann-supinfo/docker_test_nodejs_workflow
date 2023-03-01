const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const User = require('../services/user.service')
const db = require('../models');
const bcrypt = require("bcryptjs");



describe('User test', () => {

    describe('User Model', () => {

        it('should be an object', async () => {
            let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0606060606");
            expect({user}).to.be.an('object');
        });

    });

    describe('User Parameters', () => {

        // Email
        describe('User Email', () => {
            it('should be a valid email', async () => {
                let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0606060606");
                expect({user}).to.exist;
            });
            it('throw error invalid format email', async () => {
                try {
                  await User.createUser("test", "Passw0rd!", "toto", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid email');
                }
              
                try {
                  await User.createUser("toto.com", "Passw0rd!", "toto", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid email');
                }
              
                try {
                  await User.createUser("toto@email", "Passw0rd!", "toto", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid email');
                }
            });
            it('throw error empty string', async () => {
                try {
                    await User.createUser("", "Passw0rd!", "toto", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
            it('throw error not string', async () => {
                try {
                    await User.createUser(123, "Passw0rd!", "toto", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
        });

        // Lastname
        describe('User Lastname', () => {
            it('should be a valid lastname', async () => {
                let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0606060606");
                expect({user}).to.exist;
            });
            it('throw error invalid format lastname', async () => {
                try {
                  await User.createUser("toto@email.com", "Passw0rd!", "t?t?", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid lastname');
                }
              
                try {
                  await User.createUser("toto@email.com", "Passw0rd!", "t/t/", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid lastname');
                }
              
                try {
                  await User.createUser("toto@email.com", "Passw0rd!", "t.t.", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid lastname');
                }
            });
            it('throw error empty string', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
            it('throw error not string', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", 123, "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
        });

        // Firstname
        describe('User Firstname', () => {
            it('should be a valid firstname', async () => {
                let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0606060606");
                expect({user}).to.exist;
            });
            it('throw error invalid format firstname', async () => {
                try {
                  await User.createUser("toto@email.com", "Passw0rd!", "toto", "t?t?", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid firstname');
                }
              
                try {
                  await User.createUser("toto@email.com", "Passw0rd!", "toto", "t/t/", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid firstname');
                }
              
                try {
                  await User.createUser("toto@email.com", "Passw0rd!", "toto", "t.t.", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid firstname');
                }
            });
            it('throw error empty string', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
            it('throw error not string', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", 123, "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
        });

        // Phone
        describe('User Phone', () => {
            it('should be a valid phone number', async () => {
                let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "01 23 45 67 89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "01-23-45-67-89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "01.23.45.67.89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "+33123456789");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "+33 1 23 45 67 89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "+33-1-23-45-67-89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "+33.1.23.45.67.89");
                expect({user}).to.exist;
            });
            it('throw error invalid format phone number', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "+330606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'invalid phone');
                }
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "06060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'invalid phone');
                }
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "011_234_457_672_891");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'invalid phone');
                }
            });
            it('throw error empty string', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
            it('throw error not string', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", 01234567);
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
        });

        // Password
        describe('User Password', () => {
            it('should be a valid password', async () => {
                let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                expect({user}).to.exist;
            });
            it('throw error invalid password', async () => {
                try {
                    await User.createUser("toto@email.com", "password", "toto", "titi", "0123456789");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'invalid password. It should contain at least : \n- 1 uppercase\n- 1 lowercase\n- 1 special character\n- 1 number\n- 7 characters');
                }
            });
            it('should be an encrypted password', async () => {
                await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                const user = await db.user.findOne({ where: {email: "toto@email.com"} });
                expect(user.password).to.not.equal("Passw0rd!");
            });
        });

    });

    // Table User
    describe('User Database Creation', () => {
        
        describe('Table User Exist', () => {
            it('should exist', async () => {
                let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                expect({user}).to.exist;
            });
        });

        describe('Table User Doesn\'t Exist', () => {
            before(async () => {
                await db.sequelize.drop();
            });

            after(async () => {
                await db.sequelize.sync();
            });
            it('throw error table user does not exist', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                    assert.fail('users table does not exist');
                } catch (error) {
                    assert.strictEqual(error.message, 'users table does not exist');
                }
            });
        });

        describe('User Insertion Correct', () => {
            it('should exist', async () => {
                await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                const user = await db.user.findOne({ where: {email: "toto@email.com"} });
                expect(user.email).to.equal("toto@email.com");
                expect(true).to.equal(bcrypt.compareSync("Passw0rd!", user.password));
                expect(user.nom).to.equal("toto");
                expect(user.prenom).to.equal("titi");
                expect(user.telephone).to.equal("0123456789");
            });
        });

        
    });

});