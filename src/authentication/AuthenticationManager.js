import AuthenticationService from './AuthenticationService.js';
import UsernamePassword from './strategy/UsernamePassword.js';
import Google from './strategy/Google.js';
import orm from '../../db/orm.js';

const authenticationService = new AuthenticationService();

/**
 * Login the user using the authenticate method of the chosen strategy
 * @param {*} strategy - The string of the strategy being used
 * @param {*} params - The information the strategy needs to authenticate
 * @returns - The custom response object or custom error of the method
 */
async function Login(strategy, params) {
    SetStrategy(strategy);
    return authenticationService.authenticate(params);
}

/**
 * Register the user using the registerUser method of the chosen strategy
 * @param {*} strategy - The string of the strategy being used
 * @param {*} params - The information the strategy needs to register the user
 * @returns - The custom response object or custom error of the method
 */
async function Register(strategy, params) {
    SetStrategy(strategy);
    return authenticationService.registerUser(params);
}

/**
 * The switch statement to set the strategy on the authentication service
 * @param {} strategy - The string of the strategy being used
 */
function SetStrategy(strategy) {
    switch (strategy) {
        case "username-password":
            authenticationService.setStrategy(new UsernamePassword(orm));
            break;
        case "google":
            authenticationService.setStrategy(new Google(orm));
            break;
        default:
            throw new Error("Invalid authentication strategy");
    }
}

export { Login, Register }
