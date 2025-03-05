import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';

import { query } from "../../../config/db.js";
import jwt from "jsonwebtoken"; 
import bcrypt from 'bcrypt'; 
import config from 'config';
const jwtSecret = config.get('User.JWT_SECRET');

class UsernamePassword extends AuthenticationStrategyInterface {
    //should have constructor where it takes the database connection class, or it just takes the config. first option is better for OOP
    //use ORM class for the constructor

    /**
     * Authenticates the user using username and password
     * @param {*} params - username and password
     * @returns true if localStorage items set
     */
    async authenticate(params) {
        // FUTURE ORM INSTEAD OF SQL
        let user = (await query("SELECT * from users WHERE username = ?", [params.username]))[0];
        if (!user) throw "User does not exist." // prompt to register?

        let isPassword = await bcrypt.compare(params.password, user.password);
        if (isPassword) {
            let userToken = jwt.sign(
                { subject: user.id, clearance: user.clearance },
                jwtSecret,
                { expiresIn: '6h' }
            );

            return { success: true, token: userToken, clearance: user.clearance };
        }
        else {
            throw "Incorrect password."
        }
    }

    refreshAuthToken() {
        // not needed? or needed for localStorage token?
        return;
    }

    /**
     * Register a new user with email and password
     * @param {*} params - username, password, and email + anything else needed
     */
    async registerUser(params) {
        let user = await query("SELECT * FROM users WHERE username = ?", [params.username]);
        if (user.length > 0) {
            if (user[0].username === params.username) {
                throw new Error("Username already taken.");
            }
            if (user[0].email === params.email) {
                throw new Error("Email already has a registered account."); // Prompt to login?
            }
        }

        let password = await hashPassword(params.password);

        let insertParams = [params.username, password, params.email];

        await query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", insertParams);

        return { success: true, message: "User registered successfully." };
    }

    logOutUser() {
        localStorage.clear();
        // reroute???
        return;
    }
    
}

/**
 * Helper function to hash password with bcrypt
 * @param {*} password 
 * @returns 
 */
async function hashPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export default UsernamePassword;