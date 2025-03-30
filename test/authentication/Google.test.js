import Google from '../../src/authentication/strategy/Google';
import orm from '../../db/orm.js'
import Users from '../../db/Users.js'

import BadToken from '../../src/authentication/errors/BadToken.js';
import UserDoesNotExist from '../../src/authentication/errors/UserDoesNotExist.js';
import AccountExists from '../../src/authentication/errors/AccountExists.js';

import SuccessfulLogin from "../../src/authentication/responses/SuccessfulLogin.js";
import SuccessfulRegister from "../../src/authentication/responses/SuccessfulRegister.js";


// BEFORE ALL

beforeAll(async () => {
    await orm.authenticate();
    let res = await Users.findOne({ where: { user_id: "222264525376281409999" } });
    if (!res) {
        await Users.create({
            username: "DrawbridgeTesting",
            user_id: 103516449869988622982,
            email: "testingdrawbridge@gmail.com",
        });
    }
});

////////////////////////
// LOGIN TESTS
////////////////////////
test('User trying to log in with a bad token should throw BadToken error', async () => {
    await expect(new Google(orm).authenticate({ "idToken": "BadToken_eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMWYzYmM2NmYwNzUxZjc4NDA2MDY3OTliMWFkZjllOWZiNjBkZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM5ODg3MTczODg3MDc0NTY1MDgiLCJoZCI6InUuYm9pc2VzdGF0ZS5lZHUiLCJlbWFpbCI6InJlYmVjY2Fub3Zpc0B1LmJvaXNlc3RhdGUuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MzM3MTE3NiwibmFtZSI6IlJlYmVjY2EgTm92aXMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSm1KVGYtYkFYV05BN3k4M3d2eDNpZkt2R1ZYR2w0elhpcG1mZFIyZFFsOU1xdnlRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlJlYmVjY2EiLCJmYW1pbHlfbmFtZSI6Ik5vdmlzIiwiaWF0IjoxNzQzMzcxNDc2LCJleHAiOjE3NDMzNzUwNzYsImp0aSI6ImViOGVmMjBjMWY1OTY1Mzc3MDY3YzU3NmRiYjkwOTZjYTVhM2EyMTIifQ.XI1_Hncp1bS4_1dBoysmCPpse4u1W82nMDWVOyMXoXRu7WbHhNaGLuDDoZIAluWG1zY_IhlIB6yjb8-CKkEk1RBs4SsOULq_Ix8TVxj64LCTn_Qtzl2y2dk3nZ5vTSNXOg_60hZTFGoLh4YaBjTItzLU-lIrYtfkmASezCqMW3MGTIPzIKd5uLOp4c6qMq_PXzE7xPXm1lP6zbVDlwZDzmSURi-EsB8Sbywhh6R5WG1TqTNkrnIS85AVgWS4m0ILO2BJDfPVWnvncKJrBAB7I_8YDjR8QMPMeHnTZjwVZr-MK_tNGOiW34bg06TVoFTOaTypUPGGrXfN8yzv0biP5w"}))
        .rejects.toThrow(BadToken);
});

test('User that does not exist trying to log in should throw UserDoesNotExist error', async () => {
    await expect(new Google(orm).authenticate({ "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMWYzYmM2NmYwNzUxZjc4NDA2MDY3OTliMWFkZjllOWZiNjBkZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM5ODg3MTczODg3MDc0NTY1MDgiLCJoZCI6InUuYm9pc2VzdGF0ZS5lZHUiLCJlbWFpbCI6InJlYmVjY2Fub3Zpc0B1LmJvaXNlc3RhdGUuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTc0MzM3MTE3NiwibmFtZSI6IlJlYmVjY2EgTm92aXMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSm1KVGYtYkFYV05BN3k4M3d2eDNpZkt2R1ZYR2w0elhpcG1mZFIyZFFsOU1xdnlRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlJlYmVjY2EiLCJmYW1pbHlfbmFtZSI6Ik5vdmlzIiwiaWF0IjoxNzQzMzcxNDc2LCJleHAiOjE3NDMzNzUwNzYsImp0aSI6ImViOGVmMjBjMWY1OTY1Mzc3MDY3YzU3NmRiYjkwOTZjYTVhM2EyMTIifQ.XI1_Hncp1bS4_1dBoysmCPpse4u1W82nMDWVOyMXoXRu7WbHhNaGLuDDoZIAluWG1zY_IhlIB6yjb8-CKkEk1RBs4SsOULq_Ix8TVxj64LCTn_Qtzl2y2dk3nZ5vTSNXOg_60hZTFGoLh4YaBjTItzLU-lIrYtfkmASezCqMW3MGTIPzIKd5uLOp4c6qMq_PXzE7xPXm1lP6zbVDlwZDzmSURi-EsB8Sbywhh6R5WG1TqTNkrnIS85AVgWS4m0ILO2BJDfPVWnvncKJrBAB7I_8YDjR8QMPMeHnTZjwVZr-MK_tNGOiW34bg06TVoFTOaTypUPGGrXfN8yzv0biP5w" }))
        .rejects.toThrow(UserDoesNotExist);
});

test('User that exists that uses correct password should get a SuccessfulLogin response', async () => {
    const response = await new Google(orm).authenticate({ "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMWYzYmM2NmYwNzUxZjc4NDA2MDY3OTliMWFkZjllOWZiNjBkZmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MTYwMTg5MjA1NTctNzV0dTlsNGRqOTJoa2prdjg3OTlqYTEzNmlqaGd2MXQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDM1MTY0NDk4Njk5ODg2MjI5ODIiLCJlbWFpbCI6InRlc3RpbmdkcmF3YnJpZGdlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NDMzNzQ3NTMsIm5hbWUiOiJEcmF3YnJpZGdlIFRlc3RpbmciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVdhRHRDcHZfblRlRGI4WHBWNWUtb3JlWUFiUXBUWC1GSDZ0Q0IyX2daYlhNb293PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkRyYXdicmlkZ2UiLCJmYW1pbHlfbmFtZSI6IlRlc3RpbmciLCJpYXQiOjE3NDMzNzUwNTMsImV4cCI6MTc0MzM3ODY1MywianRpIjoiY2I3OTJhZjUzMjEwZDBiOWU0N2I3MDgyYTNmYzIyZGM4Y2NjNWYxZSJ9.FIBZJCRmeKUh-iuXD3hh7cTuI8sBgR4mOkkJUYYP3oD-ExlZoIeUyK7cj_n26nXkQ4Wf74WeJOp8S4m9eFbULr-iI_mpWBpVyQuSJMNuvaz8F_DzT4OMGtOuTO_Ewp9gsYe2blnSlmzA5e9pMUaFTpptwMR0kQQ5ntbj2iQ0Sncpfh939akeJJEzzdxDIJe9MtQkd1EscxcxtBD80V2WXu827EhdNzCQnCbFXvD-yvFsVYqNSSZkBT6OrH7K8RCYsxsSzrhbaPYdT_qUH6_j2C_tMuGpTESMQkrLsuKiOafi1CuejJQ0gMGSh7EsZm6nZP9pRN9rCaAM0tb1sTpj1w"});
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