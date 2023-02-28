const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const User = require('../services/user.service')

describe('User test', () => {

    describe('User Model', () => {

        it('should be an object', async () => {
            let user = await User.createUser("toto@email.com", "password", "toto", "titi", "0606060606");
            expect({user}).to.be.an('object');
        });

    });

    describe('User Creation', () => {

        // Email
        describe('User Email', () => {
            it('should be a valid email', async () => {
                let user = await User.createUser("toto@email.com", "password", "toto", "titi", "0606060606");
                expect({user}).to.exist;
            });
            it('throw error invalid format email', async () => {
                try {
                  await User.createUser("test", "password", "toto", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid email');
                }
              
                try {
                  await User.createUser("toto.com", "password", "toto", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid email');
                }
              
                try {
                  await User.createUser("toto@email", "password", "toto", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid email');
                }
            });
            it('throw error empty string', async () => {
                try {
                    await User.createUser("", "password", "toto", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
            it('throw error not string', async () => {
                try {
                    await User.createUser(123, "password", "toto", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
        });

        // Lastname
        describe('User Lastname', () => {
            it('should be a valid lastname', async () => {
                let user = await User.createUser("toto@email.com", "password", "toto", "titi", "0606060606");
                expect({user}).to.exist;
            });
            it('throw error invalid format lastname', async () => {
                try {
                  await User.createUser("toto@email.com", "password", "t?t?", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid lastname');
                }
              
                try {
                  await User.createUser("toto@email.com", "password", "t/t/", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid lastname');
                }
              
                try {
                  await User.createUser("toto@email.com", "password", "t.t.", "titi", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid lastname');
                }
            });
            it('throw error empty string', async () => {
                try {
                    await User.createUser("toto@email.com", "password", "", "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
            it('throw error not string', async () => {
                try {
                    await User.createUser("toto@email.com", "password", 123, "titi", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
        });

        // Firstname
        describe('User Firstname', () => {
            it('should be a valid firstname', async () => {
                let user = await User.createUser("toto@email.com", "password", "toto", "titi", "0606060606");
                expect({user}).to.exist;
            });
            it('throw error invalid format firstname', async () => {
                try {
                  await User.createUser("toto@email.com", "password", "toto", "t?t?", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid firstname');
                }
              
                try {
                  await User.createUser("toto@email.com", "password", "toto", "t/t/", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid firstname');
                }
              
                try {
                  await User.createUser("toto@email.com", "password", "toto", "t.t.", "0606060606");
                  assert.fail('should have thrown an error');
                } catch (error) {
                  assert.strictEqual(error.message, 'invalid firstname');
                }
            });
            it('throw error empty string', async () => {
                try {
                    await User.createUser("toto@email.com", "password", "toto", "", "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
            it('throw error not string', async () => {
                try {
                    await User.createUser("toto@email.com", "password", "toto", 123, "0606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
        });

        // Phone
        describe('User Phone', () => {
            it('should be a valid phone number', async () => {
                let user = await User.createUser("toto@email.com", "password", "toto", "titi", "0123456789");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "password", "toto", "titi", "01 23 45 67 89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "password", "toto", "titi", "01-23-45-67-89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "password", "toto", "titi", "01.23.45.67.89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "password", "toto", "titi", "+33123456789");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "password", "toto", "titi", "+33 1 23 45 67 89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "password", "toto", "titi", "+33-1-23-45-67-89");
                expect({user}).to.exist;
                user = await User.createUser("toto@email.com", "password", "toto", "titi", "+33.1.23.45.67.89");
                expect({user}).to.exist;
            });
            it('throw error invalid format phone number', async () => {
                try {
                    await User.createUser("toto@email.com", "password", "toto", "titi", "+330606060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'invalid phone');
                }
                try {
                    await User.createUser("toto@email.com", "password", "toto", "titi", "06060606");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'invalid phone');
                }
                try {
                    await User.createUser("toto@email.com", "password", "toto", "titi", "011_234_457_672_891");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'invalid phone');
                }
            });
            it('throw error empty string', async () => {
                try {
                    await User.createUser("toto@email.com", "password", "toto", "titi", "");
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
            it('throw error not string', async () => {
                try {
                    await User.createUser("toto@email.com", "password", "toto", "titi", 01234567);
                    assert.fail('should have thrown an error');
                } catch (error) {
                    assert.strictEqual(error.message, 'should be a string not empty');
                }
            });
        });

    });

});