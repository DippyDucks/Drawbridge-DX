import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';

const db = require("./db"); // ??
const jwt = require("jsonwebtoken"); // ??
const bcrypt = require('bcrypt'); // ??

class UsernamePassword extends AuthenticationStrategyInterface {
    //should have constructor where it takes the database connection class, or it just takes the config. first option is better for OOP
    //use ORM class for the constructor
    /**
     * concrete method
     */
    async authenticate(params) {
        // FUTURE ORM INSTEAD OF SQL
        let user = await db.query("SELECT * from users WHERE username = ?", [params.username]);
        if (!user) throw "User does not exist." // prompt to register?

        let isPassword = await bcrypt.compare(params.password, user.password);
        if (isPassword) {
            let userToken = jwt.sign(
                { subject: user.id, clearance: user.control },
                process.env.JWT_Secret,
                { expiresIn: '6h' }
            );
          // CREATE SESSION TOKEN ??  return { token: userToken, clearance: user.control };
          // I assume every login strategy should return a login token back to the service, the service will then handle it
        }
        else {
            throw "Incorrect password."
        }
    }

    refreshAuthToken() {
        return;
    }

    async registerUser(params) {
        let user = await db.query("SELECT * from users WHERE username = ?", [params.username]);
        if(user) {
            throw "Username already taken."
        }

        // apply salt with bcrypt
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(params.password, salt, function(err, hash) {
                      // Store hash in database here
             });
        });

        // login after created 
        return;
    }

    logOutUser() {
        // clear session and send to a home page
        return;
    }
  
}

export default UsernamePassword;