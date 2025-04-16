import Google from '../../src/authentication/strategy/Google.js';
import orm from '../../db/orm.js';
import Users from '../../db/Users.js';
import config from 'config';
const testingInfo = config.get("AuthenticateStrategies.SocialMedia.Google.Testing_Info");

import { UserDoesNotExist, BadToken, AccountExists } from '../../src/authentication/errors/index.js';
import { SuccessfulLogin, SuccessfulRegister } from "../../src/authentication/responses/index.js";

// BEFORE ALL
let realIdToken;
let noUserIdToken;

beforeAll(async () => {
  //create user
  await orm.authenticate();
  await Users.sync(); 
  //creates a new user to test first if you need it. replace the user_id and email with the user_id and email that the valid token should hold 
    let res = await Users.findOne({ where: { user_id: "113988717388707456508" } });
    if (!res) {
        await Users.create({
            username: "ValidTest",
            user_id: "113988717388707456508",
            email: "rebeccanovis@u.boisestate.edu",
        });
    }
  //get real id token (valid, user was just created)
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: testingInfo.Client_ID,
      client_secret: testingInfo.Client_Secret,
      refresh_token: testingInfo.Valid_Refresh_Token,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();

  if (!data.id_token) {
    throw new Error(`Failed to fetch id_token: ${JSON.stringify(data)}`);
  }
  console.log("!!! data: ", data);
  realIdToken = data.id_token;

  //get real id token (not valid, user doesn't exist)
  const noUserResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: testingInfo.Client_ID,
      client_secret: testingInfo.Client_Secret,
      refresh_token: testingInfo.Invalid_Refresh_Token,
      grant_type: 'refresh_token',
    }),
  });

  const invalidData = await noUserResponse.json();

  if (!invalidData.id_token) {
    throw new Error(`Failed to fetch id_token: ${JSON.stringify(invalidData)}`);
  }

  noUserIdToken = invalidData.id_token;
});

////////////////////////
// LOGIN TESTS 
////////////////////////

test('User trying to log in with a bad token should throw BadToken error', async () => {
    await expect(new Google(orm).authenticate({ "id_token": "BadToken"}))
        .rejects.toThrow(BadToken);
});

test('User that does not exist trying to log in should throw UserDoesNotExist error', async () => {
    await expect(new Google(orm).authenticate({ "id_token": noUserIdToken }))
        .rejects.toThrow(UserDoesNotExist);
});

test('User with an id_token that contains a user_id and email that already exist should get a SuccessfulLogin response', async () => {
    const response = await new Google(orm).authenticate({ "id_token": realIdToken});
    expect(response).toBeInstanceOf(SuccessfulLogin);
});

////////////////////////
// REGISTER TESTS
////////////////////////
test('User registering with an username already registered should throw AccountExists error with type Username', async () => {
    await expect(new Google(orm).registerUser({ "username": "ValidTest" }))
        .rejects
        .toThrowError(new AccountExists('Username already taken.', { type: 'Username' }));
});

test('User that registers with a new email, user_id, and username should get a SuccessfulRegister response', async () => {
    const response = await new Google(orm).registerUser({ "email": "test@gmail.com", "user_id": "111164525376281406000", "username": "TestUser" });
    expect(response).toBeInstanceOf(SuccessfulRegister);
});

// AFTER ALL

afterAll(async () => {
    await Users.destroy({ where: { username: "TestUser"} }); // 
  
    await orm.sync(); 
    await orm.close();
  });