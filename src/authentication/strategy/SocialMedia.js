import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';
import { OAuth2Client } from 'google-auth-library';
import { query } from "../../../config/db.js";
import jwt from "jsonwebtoken";
import config from 'config';
const ClientID = config.get('AuthenticateStrategies.SocialMedia.Google.Client_ID');
console.log("ClientID: ", ClientID);
const client = new OAuth2Client(ClientID);
const jwtSecret = config.get("User.JWT_SECRET");


class Google extends AuthenticationStrategyInterface {
    /**
     * TODO: constructor for getting database info
     */
    /**
     * concrete method
     */
    async authenticate(params) {
        //verify ID token
        console.log("params: ", params);
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

            console.log("userID: ", userID);
            console.log('email: ', email);

            let user = (await query("SELECT * FROM users WHERE email = ? AND user_id = ?", [email, userID]))[0];
            if (!user) return { success: false, needsRegistration: true, userID, email, message: "User does not exist, prompting registration." };

            //jwt token for existing user
            let userToken = jwt.sign(
                { subject: user.id, clearance: user.clearance },
                jwtSecret,
                { expiresIn: '6h' }
            );

            return { success: true, token: userToken, clearance: user.clearance };
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
        /*if (params.username) {
            let user = await query("SELECT * FROM users WHERE username = ?", [params.username]);
            if (user.length > 0) {
                if (user[0].username === params.username) {
                    throw new Error("Username already taken.");
                }
                if (user[0].email === params.email) {
                    throw new Error("Email already has a registered account."); // Prompt to login?
                }
            }
            if (params.password) {
                let password = await hashPassword(params.password);

                let insertParams = [params.username, password, params.email, params.userID];

                await query("INSERT INTO users (username, password, email, userID) VALUES (?, ?, ?, ?)", insertParams);
            }
        } */
       console.log("register params: ", params);
            let insertParams = [params.email, params.userID];
            
            await query("INSERT INTO users (email, user_id) VALUES (?, ?)", insertParams);
        




        return { success: true, message: "User registered successfully." };
    }

    logOutUser(params) {
        const auth2 = params.auth2;
        auth2.signOut().then(function () {
            console.log('User signed out.');
            //any other post-sign-out actions, like changing to sign in page?
        });
    }

}

class Instagram extends AuthenticationStrategyInterface {
    /**
     * concrete method
     */
    authenticate(params) {
        // 
    }

    refreshAuthToken() {

    }

    registerUser() {

    }

    logOutUser() {

    }

}

class Facebook extends AuthenticationStrategyInterface {
    /**
     * concrete method
     */
    authenticate(params) {
        // 
    }

    refreshAuthToken() {

    }

    registerUser() {

    }

    logOutUser() {

    }

}

export { Google, Instagram, Facebook };