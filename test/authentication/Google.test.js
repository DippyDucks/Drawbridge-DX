import Google from '../../src/authentication/strategy/Google';
import orm from '../../db/orm.js'
import Users from '../../db/Users.js'
import jwt from 'jsonwebtoken';

import BadToken from '../../src/authentication/errors/BadToken.js';
import UserDoesNotExist from '../../src/authentication/errors/UserDoesNotExist.js';
import AccountExists from '../../src/authentication/errors/AccountExists.js';

import SuccessfulLogin from "../../src/authentication/responses/SuccessfulLogin.js";
import SuccessfulRegister from "../../src/authentication/responses/SuccessfulRegister.js";


// BEFORE ALL
//genrate test tokens
const generateTestToken = (payload = {}) => {
    const privateKey = "test_private_key"; // Replace with an actual private key if needed.
    
    return jwt.sign(
        {
            iss: "https://accounts.google.com",
            azp: "test_client_id",
            aud: "test_client_id",
            sub: payload.sub || "10351644986998860000", // Test user ID
            email: payload.email || "testingdrawbridge@gmail.com",
            email_verified: true,
            name: payload.name || "Valid Test",
            picture: payload.picture || "https://example.com/profile.jpg",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
            jti: "test_jti"
        },
        privateKey, // Use a real private key if necessary
        { algorithm: "RS256" } // Use RS256 if matching Google JWTs
    );
};

//creates a new user to test first if you need it.
beforeAll(async () => {
    await orm.authenticate();
    let res = await Users.findOne({ where: { user_id: "10351644986998860000" } });
    if (!res) {
        await Users.create({
            username: "ValidTest",
            user_id: "10351644986998860000",
            email: "testvalid@gmail.com",
        });
    }
});

////////////////////////
// LOGIN TESTS 
////////////////////////

test('User trying to log in with a bad token should throw BadToken error', async () => {
    await expect(new Google(orm).authenticate({ "id_token": "BadToken"}))
        .rejects.toThrow(BadToken);
});

test('User that does not exist trying to log in should throw UserDoesNotExist error', async () => {
    const fakeToken = generateTestToken({
        sub: "non_existent_user",
        email: "doesnotexist@example.com"
    })
    await expect(new Google(orm).authenticate({ "id_token": fakeToken }))
        .rejects.toThrow(UserDoesNotExist);
});

test('User with an id_token that contains a user_id and email that already exist should get a SuccessfulLogin response', async () => {
    const validToken = generateTestToken({
        sub: "10351644986998860000",
        email: "testvalid@gmail.com"
    })
    const response = await new Google(orm).authenticate({ "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMWYzYmM2NmYwNzUxZjc4NDA2MDY3OTliMWFkZjllOWZiNjBkZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM1MTY0NDk4Njk5ODg2MjI5ODIiLCJlbWFpbCI6InRlc3RpbmdkcmF3YnJpZGdlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NDMzODAzMTcsIm5hbWUiOiJEcmF3YnJpZGdlIFRlc3RpbmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVdhRHRDcHZfblRlRGI4WHBWNWUtb3JlWUFiUXBUWC1GSDZ0Q0IyX2daYlhNb293PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkRyYXdicmlkZ2UiLCJmYW1pbHlfbmFtZSI6IlRlc3RpbmciLCJpYXQiOjE3NDMzODA2MTcsImV4cCI6MTc0MzM4NDIxNywianRpIjoiZTk4NmMzMjM5NTM1Y2RhYTVmYWY3MWIzNmEyMGI4MzRiYmNlYTRmMSJ9.dFvGhE01x-IfMEyZL8w8QLLvyOk_9cIWbPLSWX6JdWkwmX4IrqZ93Nrmm599epnFjWyHiyuFLonMIb1SjPi6F5dA18MqrijyaCeAS8N_xS_Gcob9T6VgLdDqvNpo4hPWAlkqMCKKvath8_FOfoIbW9IXwJiZHSjt-UEiS2PT17GN3KvFSYYPgayUf07AjZnQQCLcw5iI7rhSKeo0NCiZQblYY9AFq3UlcoLCJalkR-TdexTJtBaXNb4PwqUSA79CUk7vzpFf1341M5gGfsOMHKbjpv6S3Y70D1un_uVyVkNFmjcoxor3kD9HkUgOF3mOqA95EtERFxINCRRZMSU_DQ"});
    expect(response).toBeInstanceOf(SuccessfulLogin);
});

////////////////////////
// REGISTER TESTS
////////////////////////
test('User registering with an username already registered should throw AccountExists error with type Username', async () => {
    await expect(new Google(orm).registerUser({ "username": "DrawbridgeTesting" }))
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