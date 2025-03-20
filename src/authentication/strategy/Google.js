import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from "jsonwebtoken";
import config from 'config';
import User from '../../../db/Users.js'
import UserDoesNotExist from '../errors/UserDoesNotExist.js';
import IncorrectPassword from '../errors/IncorrectPassword.js';
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
        console.log("inside google authenticate method");
        //verify ID token
        try {
            const ticket = await client.verifyIdToken({
                idToken: params.idToken,
                audience: ClientID
            });

            if (!ticket) {
                throw 'somethings wrong with the ticket :('
            }

            //get user's payload (info)
            const payload = ticket.getPayload();
            const userID = payload['sub']; //google's unique user ID
            const email = payload.email //user's email address

            console.log("payload: ", payload);

            let user = await User.findOne({ where: { email: email, user_id: userID } });
            if (!user) return { success: false, needsRegistration: true, userID, email, message: "User does not exist, prompting registration." };

            //jwt token for existing user
            let userToken = jwt.sign(
                { subject: user.id, clearance: user.clearance },
                jwtSecret,
                { expiresIn: '6h' }
            );

            return new SuccessfulLogin("Log in success.", userToken, user.clearance);
        }
        catch (error) {
            console.error("Error verifying token:", error);
            return { success: false, message: error };
        }


    }

    refreshAuthToken() {
        //check if token still good, if it  is, just return, if not, refresh it.

    }

    async registerUser(params) {

        await User.create({ email: params.email, user_id: params.userID });

        return { success: true, message: "User registered successfully." };
    }

    logOutUser(params) {
        const auth2 = params.auth2;
        auth2.signOut().then(function () {
            //any other post-sign-out actions, like changing to sign in page?
        });
    }

}

export default Google;