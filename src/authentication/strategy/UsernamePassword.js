import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';

import { UserDoesNotExist, IncorrectPassword, AccountExists } from '../errors';
import SuccessfulLogin from '../responses/SuccessfulLogin.js';
import SuccessfulRegister from '../responses/SuccessfulRegister.js';
import User from '../../../db/Users.js';

import jwt from "jsonwebtoken"; 
import bcrypt from 'bcrypt'; 
import config from 'config';
const JWT = config.get('JWT');

/**
 * Strategy for authenticating with a username and password.
 * Constructor takes in an orm instance
 */
class UsernamePassword extends AuthenticationStrategyInterface {
    constructor(ormInstance) {
        super();
        this.orm = ormInstance || User.orm;
    }  

    /**
     * Authenticate a user
     * @param {*} params - the username and password
     * @returns SuccessfulLogin(token, clearance)
     * @throws UserDoesNotExist(message), IncorrectPassword(message)
     */
    async authenticate(params) {
        let user = await User.findOne({ where: { username: params.username } });
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
        let user = await User.findOne({ where: { username: params.username } });
        if (user) {
            throw new AccountExists("Username already taken.", "Username");
        }

        user = await User.findOne({ where: { email: params.email } });
        if (user) {
            throw new AccountExists("Email already has a registered account.", "Email");
        }

        let password = await this.hashPassword(params.password);

        const newUser = await User.create({
            username: params.username,
            password: password,
            email: params.email,
        });

        return new SuccessfulRegister("User registered successfully.", newUser.toJSON());
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
    * @returns - hashed password
    */
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
}

export default UsernamePassword;