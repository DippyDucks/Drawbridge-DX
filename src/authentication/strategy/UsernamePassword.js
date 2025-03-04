import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';

const db = require("./db"); // ??
const jwt = require("jsonwebtoken"); // ??
const bcrypt = require('bcrypt'); // ??

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
        let user = (await db.query("SELECT * from users WHERE username = ?", [params.username]))[0];
        if (!user) throw "User does not exist." // prompt to register?

        let isPassword = await bcrypt.compare(params.password, user.password);
        if (isPassword) {
            let userToken = jwt.sign(
                { subject: user.id, clearance: user.clearance },
                // CONFIG JWT SECRET ??,
                { expiresIn: '6h' }
            );
            localStorage.setItem('token', userToken);
            localStorage.setItem('clearance', user.clearance);
            return true; // ?? what should I return? should it just reroute?
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
        let user = await db.query("SELECT * FROM users WHERE username = ?", [params.username]);
        let password;
        if(user[0].username) {
            throw "Username already taken."
        }
        if(user[0].email) {
            throw "Email already has registered account." // prompt to login?
        }

        // apply salt with bcrypt
        if (params.password) {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(params.password, salt, function(err, hash) {
                    password = hash;
                });
            });
        }

        let insertParams = [params.username, password, params.email];

        await db.query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", insertParams);

        // log in after created
        this.authenticate(insertParams);
    }

    logOutUser() {
        localStorage.clear();
        // reroute???
        return;
    }
}

export default UsernamePassword;