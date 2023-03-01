const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const User = require('../services/user.service')
const db = require('../models');
const bcrypt = require("bcryptjs");

describe('User test', () => {

    describe('User Model', () => {

        before(async () => {
            await db.role.destroy({ where: {} });
            await db.reservation.destroy({ where: {} });
            await db.user.destroy({ where: {} });
        });

        it('should be an object', async () => {
            let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0606060606");
            expect({user}).to.be.an('object');
        });

    });

    describe('User Parameters', () => {

        // Email
        describe('User Email', () => {

            before(async () => {
                await db.role.destroy({ where: {} });
                await db.reservation.destroy({ where: {} });
                await db.user.destroy({ where: {} });
            });

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
            it('throw error null', async () => {
                try {
                    await User.createUser(null, "Passw0rd!", "toto", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'mail is null');
                }
            });
            it('throw error length more than 50', async () => {
                try {
                    await User.createUser("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@mail.com", "Passw0rd!", "toto", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'mail is more than 50 characters');
                }
            });
        });

        // Lastname
        describe('User Lastname', () => {

            before(async () => {
                await db.role.destroy({ where: {} });
                await db.reservation.destroy({ where: {} });
                await db.user.destroy({ where: {} });
            });

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
            it('throw error null', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", null, "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'lastname is null');
                }
            });
            it('throw error length more than 50', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "totoaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'lastname is more than 50 characters');
                }
            });
        });

        // Firstname
        describe('User Firstname', () => {

            before(async () => {
                await db.role.destroy({ where: {} });
                await db.reservation.destroy({ where: {} });
                await db.user.destroy({ where: {} });
            });

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
            it('throw error null', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", null, "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'firstname is null');
                }
            });
            it('throw error length more than 50', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'firstname is more than 50 characters');
                }
            });
        });

        // Phone
        describe('User Phone', () => {

            before(async () => {
                await db.role.destroy({ where: {} });
                await db.reservation.destroy({ where: {} });
                await db.user.destroy({ where: {} });
            });

            it('should be a valid phone number', async () => {
                let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456780");
                expect({user}).to.exist;
                user = await User.createUser("toto1@email.com", "Passw0rd!", "toto", "titi", "01 23 45 67 81");
                expect({user}).to.exist;
                user = await User.createUser("toto2@email.com", "Passw0rd!", "toto", "titi", "01-23-45-67-82");
                expect({user}).to.exist;
                user = await User.createUser("toto3@email.com", "Passw0rd!", "toto", "titi", "01.23.45.67.83");
                expect({user}).to.exist;
                user = await User.createUser("toto4@email.com", "Passw0rd!", "toto", "titi", "+33123456784");
                expect({user}).to.exist;
                user = await User.createUser("toto5@email.com", "Passw0rd!", "toto", "titi", "+33 1 23 45 67 85");
                expect({user}).to.exist;
                user = await User.createUser("toto6@email.com", "Passw0rd!", "toto", "titi", "+33-1-23-45-67-86");
                expect({user}).to.exist;
                user = await User.createUser("toto7@email.com", "Passw0rd!", "toto", "titi", "+33.1.23.45.67.87");
                expect({user}).to.exist;
            });
            it('should be a valid phone number', async () => {
                let phone = User.formatPhoneNumber("+33 1 23 45 67 89");
                expect(phone).to.equal("0123456789");

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
            it('throw error null', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", null);
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'phone is null');
                }
            });
        });

        // Password
        describe('User Password', () => {

            beforeEach(async () => {
                await db.role.destroy({ where: {} });
                await db.reservation.destroy({ where: {} });
                await db.user.destroy({ where: {} });
            });

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
            it('throw error null', async () => {
                try {
                    await User.createUser("toto@email.com", null, "toto", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'password is null');
                }
            });
            it('throw error length more than 50', async () => {
                try {
                    await User.createUser("toto@email.com", "Paaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaassw0rd!", "toto", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'password is more than 50 characters');
                }
            });
        });

    });

    // Table User
    describe('User Database Creation', () => {
        
        describe('Table User Exist', () => {

            before(async () => {
                await db.role.destroy({ where: {} });
                await db.reservation.destroy({ where: {} });
                await db.user.destroy({ where: {} });
            });

            it('should exist', async () => {
                let user = await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                expect({user}).to.exist;
            });
        });

        describe('Table User Doesn\'t Exist', () => {
            before(async () => {
                await db.sequelize.drop();
            });

            it('throw error table user does not exist', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                    assert.fail('users table does not exist');
                } catch (error) {
                    assert.strictEqual(error.message, 'users table does not exist');
                }
            });

            after(async () => {
                await db.sequelize.sync();
            });
        });

        describe('User Insertion', () => {

            beforeEach(async () => {
                await db.role.destroy({ where: {} });
                await db.reservation.destroy({ where: {} });
                await db.user.destroy({ where: {} });
            });

            it('should insert corretly', async () => {
                await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                const user = await db.user.findOne({ where: {email: "toto@email.com"} });
                console.log("debug : ", user);
                expect(user.email).to.equal("toto@email.com");
                expect(true).to.equal(bcrypt.compareSync("Passw0rd!", user.password));
                expect(user.nom).to.equal("toto");
                expect(user.prenom).to.equal("titi");
                expect(user.telephone).to.equal("0123456789");
            });

            it('throw error user already exist', async () => {
                try {
                    await User.createUser("toto@email.com", "Passw0rd!", "toto", "titi", "0123456789");
                    assert.fail('user already exist');
                } catch (error) {
                    assert.strictEqual(error.message, 'user already exist');
                }
            });
        });
      
    });

});