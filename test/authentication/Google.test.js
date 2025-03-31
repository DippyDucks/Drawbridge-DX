import Google from '../../src/authentication/strategy/Google';
import orm from '../../db/orm.js'
import Users from '../../db/Users.js'

import BadToken from '../../src/authentication/errors/BadToken.js';
import UserDoesNotExist from '../../src/authentication/errors/UserDoesNotExist.js';
import AccountExists from '../../src/authentication/errors/AccountExists.js';

import SuccessfulLogin from "../../src/authentication/responses/SuccessfulLogin.js";
import SuccessfulRegister from "../../src/authentication/responses/SuccessfulRegister.js";


// BEFORE ALL

/* //creates a new user to test first if you need it.
beforeAll(async () => {
    await orm.authenticate();
    let res = await Users.findOne({ where: { user_id: "222264525376281409999" } });
    if (!res) {
        await Users.create({
            username: "DrawbridgeTesting",
            user_id: "103516449869988622982",
            email: "testingdrawbridge@gmail.com",
        });
    }
});*/

////////////////////////
// LOGIN TESTS 
////////////////////////

//NOTE: for each login test, since they take tokens that expire, you'll have to use new tokens each time you test

test('User trying to log in with a bad token should throw BadToken error', async () => {
    await expect(new Google(orm).authenticate({ "id_token": "BadToken_eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMWYzYmM2NmYwNzUxZjc4NDA2MDY3OTliMWFkZjllOWZiNjBkZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM5ODg3MTczODg3MDc0NTY1MDgiLCJoZCI6InUuYm9pc2VzdGF0ZS5lZHUiLCJlbWFpbCI6InJlYmVjY2Fub3Zpc0B1LmJvaXNlc3RhdGUuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MzM3MTE3NiwibmFtZSI6IlJlYmVjY2EgTm92aXMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSm1KVGYtYkFYV05BN3k4M3d2eDNpZkt2R1ZYR2w0elhpcG1mZFIyZFFsOU1xdnlRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlJlYmVjY2EiLCJmYW1pbHlfbmFtZSI6Ik5vdmlzIiwiaWF0IjoxNzQzMzcxNDc2LCJleHAiOjE3NDMzNzUwNzYsImp0aSI6ImViOGVmMjBjMWY1OTY1Mzc3MDY3YzU3NmRiYjkwOTZjYTVhM2EyMTIifQ.XI1_Hncp1bS4_1dBoysmCPpse4u1W82nMDWVOyMXoXRu7WbHhNaGLuDDoZIAluWG1zY_IhlIB6yjb8-CKkEk1RBs4SsOULq_Ix8TVxj64LCTn_Qtzl2y2dk3nZ5vTSNXOg_60hZTFGoLh4YaBjTItzLU-lIrYtfkmASezCqMW3MGTIPzIKd5uLOp4c6qMq_PXzE7xPXm1lP6zbVDlwZDzmSURi-EsB8Sbywhh6R5WG1TqTNkrnIS85AVgWS4m0ILO2BJDfPVWnvncKJrBAB7I_8YDjR8QMPMeHnTZjwVZr-MK_tNGOiW34bg06TVoFTOaTypUPGGrXfN8yzv0biP5w"}))
        .rejects.toThrow(BadToken);
});

test('User that does not exist trying to log in should throw UserDoesNotExist error', async () => {
    await expect(new Google(orm).authenticate({ "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMWYzYmM2NmYwNzUxZjc4NDA2MDY3OTliMWFkZjllOWZiNjBkZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM5ODg3MTczODg3MDc0NTY1MDgiLCJoZCI6InUuYm9pc2VzdGF0ZS5lZHUiLCJlbWFpbCI6InJlYmVjY2Fub3Zpc0B1LmJvaXNlc3RhdGUuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MzM4MTI1OSwibmFtZSI6IlJlYmVjY2EgTm92aXMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSm1KVGYtYkFYV05BN3k4M3d2eDNpZkt2R1ZYR2w0elhpcG1mZFIyZFFsOU1xdnlRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlJlYmVjY2EiLCJmYW1pbHlfbmFtZSI6Ik5vdmlzIiwiaWF0IjoxNzQzMzgxNTU5LCJleHAiOjE3NDMzODUxNTksImp0aSI6ImM5M2NmN2IwZmFlYjVjMjczZmY5N2M2YzZlYWE0YjZmMmZlMmI3YjUifQ.izV4GNVUQhRMwKaExueRyujJV8FJi1RZNtv4EZtcF-Nwk3GlgLqGUU13Ul6aRtlPReWPUYGH7G21R04i92UFv-BkZLX9U48XDZkJUEllTPYXhDVaXdn5sci_NkP9gWc4QBC3Az6cO1JdgzGnofGKs_78FucDI1FaST3Kb_KMobsuDwbWNfucMIIG_Ph6G41wUgNOCVEz9G0XraO8agI40wbNSUOG1QB3n7BYOc4q5aI3WSXjTL1oyV9Ki7l7-fD09g8-gYzYRxC9QrrFdq_0p4Y5jq1tB9NUhcHOwcRacF3j3OnPXtaDh_l4ICWaOZ8Mj6uVBA_HO2SXN4LYhUpK4Q" }))
        .rejects.toThrow(UserDoesNotExist);
});

test('User with an id_token that contains a user_id and email that already exist should get a SuccessfulLogin response', async () => {
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