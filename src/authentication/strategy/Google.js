import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from "jsonwebtoken";
import config from 'config';
import User from '../../../db/Users.js'
import UserDoesNotExist from '../errors/UserDoesNotExist.js';
import BadToken from '../errors/BadToken.js';
import AccountExists from '../errors/AccountExists.js';
import SuccessfulLogin from '../responses/SuccessfulLogin.js';
import SuccessfulRegister from '../responses/SuccessfulRegister.js';


const ClientID = config.get('AuthenticateStrategies.SocialMedia.Google.Client_ID');
const client = new OAuth2Client(ClientID);
const jwtSecret = config.get("JWT.SECRET");


class Google extends AuthenticationStrategyInterface {
    /**
     *  constructor for getting database info
     */
    constructor(ormInstance) {
        super();
        this.orm = ormInstance || User.orm;
    }
    /**
     * concrete method
     */
    async authenticate(params) {
        //verify ID token
            const ticket = await client.verifyIdToken({
                idToken: params.id_token,
                audience: ClientID
            });

            if (!ticket) {
                throw new BadToken("There was an issue verifying the token.");
            }

            //get user's payload (info)
            const payload = ticket.getPayload();
            const userID = payload['sub']; //google's unique user ID
            const email = payload.email; //user's email address
            const givenName = payload.given_name;
            const familyName = payload.family_name;

            console.log("payload", payload);

            let user = await User.findOne({ where: { email: email, user_id: userID } });
            if (!user){
                console.log("whoopsie!!");
                throw new UserDoesNotExist("User does not exist.", {email: email, userID: userID, username: givenName+familyName});
            } 

            //jwt token for existing user
            let userToken = jwt.sign(
                { subject: user.id, clearance: user.clearance },
                jwtSecret,
                { expiresIn: '6h' }
            );

            console.log("success? maybe???");
            return new SuccessfulLogin("Log in success.", userToken, user.clearance);
    }

    refreshAuthToken() {
        //check if token still good, if it  is, just return, if not, refresh it.

    }

    async registerUser(params) {
        console.log("register user params: ", params);

        const newUser = await User.create({ email: params.email, user_id: params.userID, username: params.username });

        return new SuccessfulRegister("User registered successfully.", newUser.toJSON());
    }

    logOutUser(params) {
        const auth2 = params.auth2;
        auth2.signOut().then(function () {
            //any other post-sign-out actions, like changing to sign in page?
        });
    }

}

export default Google;