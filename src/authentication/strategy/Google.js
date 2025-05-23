import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from "jsonwebtoken";
import { getConfig } from '../../config.js';
import User from '../../../db/Users.js'
import { UserDoesNotExist, BadToken, AccountExists } from '../errors';
import { SuccessfulLogin, SuccessfulRegister } from "../responses";

const ClientID = getConfig().AuthenticationStrategies.Google.Client_ID;
const client = new OAuth2Client(ClientID);
const JWT = getConfig().JWT;

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
        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken: params.id_token,
                audience: ClientID
            });
        } catch (error) {
            throw new BadToken("There was an issue verifying the token.");
        }

        //get user's payload (info)
        const payload = ticket.getPayload();
        const userID = payload['sub']; //google's unique user ID
        const email = payload.email; //user's email address
        const givenName = payload.given_name;
        const familyName = payload.family_name;

        let user = await User.findOne({ where: { email: email, user_id: userID } });
        if (!user) {
            throw new UserDoesNotExist("User does not exist.", { email: email, userID: userID, username: givenName + familyName });
        }

        //jwt token for existing user
        let userToken = jwt.sign(
            { subject: user.id, clearance: user.clearance },
            JWT.SECRET,
            {expiresIn: JWT.expires_in}
        );

        return new SuccessfulLogin("Log in success.", userToken, user.clearance);
    }

    refreshAuthToken() {
        //check if token still good, if it  is, just return, if not, refresh it.

    }

    async registerUser(params) {
        let username = params.username;
        let user = await User.findOne({ where: { username: params.username } });
        if (user) {
            // Keep generating a new username until we find a unique one
            do {
                let randomNum = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
                username = `${params.username}${randomNum}`;
                user = await User.findOne({ where: { username: username } }); // Check if this new username exists
            } while (user);  // Repeat if the username is already taken
            throw new AccountExists("Username already taken. Generated a unique username.", "Username");
        }

        const newUser = await User.create({ email: params.email, user_id: params.userID, username: username });

        return new SuccessfulRegister("User registered successfully.", newUser.toJSON());
    }

    logOutUser(params) {
        const auth2 = params.auth2;
        auth2.signOut().then(function () {
            return;
        });
    }

}

export default Google;