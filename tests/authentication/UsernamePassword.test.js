import UsernamePassword from "../../src/authentication/strategy/UsernamePassword.js";
import orm from '../../db/orm.js';
import Users from "../../db/Users.js";

import { UserDoesNotExist, IncorrectPassword, AccountExists } from '../../src/authentication/errors';
import { SuccessfulLogin, SuccessfulRegister } from "../../src/authentication/responses";

// BEFORE ALL

beforeAll(async () => {
  await orm.authenticate(); 
  let password = await new UsernamePassword(orm).hashPassword("leiadog12");
  let res = await Users.findOne({ where: { username: "JC" } });
  if (!res) {
    await Users.create({
      username: "JC",
      password: password,
      email: "leiadog11@gmail.com",
    });
  }
});

////////////////////////
// LOGIN TESTS
////////////////////////

test('User that does not exist trying to log in should throw UserDoesNotExist error', async () => {
  await expect(new UsernamePassword(orm).authenticate({"username": "I AM A FAKE USER"}))
    .rejects.toThrow(UserDoesNotExist);      
});

test('User that uses incorrect password should throw IncorrectPassword error', async () => {
  await expect(new UsernamePassword(orm).authenticate({"username": "JC", "password": "WRONG PASSWORD"})).
    rejects.toThrow(IncorrectPassword);      
});

test('User that exists that uses correct password should get a SuccessfulLogin response', async () => {
  const response = await new UsernamePassword(orm).authenticate({"username": "JC", "password": "leiadog12"});
  expect(response).toBeInstanceOf(SuccessfulLogin);
});

////////////////////////
// REGISTER TESTS
////////////////////////

test('User registering with an username already registered should throw AccountExists error with type Username', async () => {
  await expect(new UsernamePassword(orm).registerUser({"username": "JC"}))
  .rejects
  .toThrowError(new AccountExists('Username already taken.', { type: 'Username' })); 
});

test('User registering with an email already registered should throw AccountExists error with type Email', async () => {
  await expect(new UsernamePassword(orm).registerUser({"username": "SUPERGUY", "email": "leiadog11@gmail.com"}))
  .rejects
  .toThrowError(new AccountExists('Email already has a registered account.', { type: 'Email' })); 
});

test('User that registers with a new username and email should get a SuccessfulRegister response', async () => {
  const response = await new UsernamePassword(orm).registerUser({"username": "SUPERGUY", "password": "SUPER PASSWORD", "email": "SUPEREMAIL@gmail.com"});
  expect(response).toBeInstanceOf(SuccessfulRegister);
});

// AFTER ALL

afterAll(async () => {
  await Users.destroy({ where: { username: "SUPERGUY" } }); // regretfully remove SUPERGUY

  await orm.sync(); 
  await orm.close();
});
