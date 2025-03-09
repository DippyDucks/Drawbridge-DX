import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';
import { UserDoesNotExist, IncorrectPassword, AccountExists } from '../errors';
import { SuccessfulLogin, SuccessfulRegister } from '../responses';

import { query } from "../../../config/db.js";
import jwt from "jsonwebtoken"; 
import bcrypt from 'bcrypt'; 
import config from 'config';
const JWT = config.get('JWT');

/**
 * Strategy for authenticating with a username and password.
 */
class UsernamePassword extends AuthenticationStrategyInterface {

    /**
     * TODO: Implement constructor to take in database connection file OR ORM
    */    

    /**
     * Authenticate a user
     * @param {*} params - the username and password
     * @returns SuccessfulLogin(token, clearance)
     * @throws UserDoesNotExist(message), IncorrectPassword(message)
     */
    async authenticate(params) {
        // FUTURE ORM INSTEAD OF SQL
        let user = (await query("SELECT * from users WHERE username = ?", [params.username]))[0];
        if (!user) throw new UserDoesNotExist("User does not exist.");
        let isPassword = await bcrypt.compare(params.password, user.password);
        if (isPassword) {
            let userToken = jwt.sign({subject: user.id, clearance: user.clearance}, JWT.SECRET, {expiresIn: JWT.expires_in});
            return new SuccessfulLogin("Log in success.", userToken, user.clearance);
        }
        else {
            throw new IncorrectPassword("Incorrect password.");
        }
    }

    /**
     * Register a new user
     * @param {*} params - username, password, email + anything else needed
     * @returns SuccessfulRegister(message)
     * @throws AccountExists(message, type)
     */
    async registerUser(params) {
        let user = await query("SELECT * FROM users WHERE username = ?", [params.username]);
        if (user.length > 0) {
            if (user[0].username === params.username) {
                throw new AccountExists("Username already taken.", "Username");
            }
            if (user[0].email === params.email) {
                throw new AccountExists("Email already has a registered account.", "Email");
            }
        }

        let password = await hashPassword(params.password);
        let insertParams = [params.username, password, params.email];

        await query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", insertParams);

        return new SuccessfulRegister("User registered successfully.");
    }

    refreshAuthToken() {
        return;
    }
    
    logOutUser() {
        return;
    }

    /**
    * Helper function to hash password with bcrypt
    * @param {*} password 
    * @returns 
    */
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(Math.floor(Math.random() * (100 - 10 + 1)) + 10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
}

export default UsernamePassword;