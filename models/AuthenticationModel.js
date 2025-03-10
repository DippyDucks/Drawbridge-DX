import AuthenticationService from '../src/authentication/AuthenticationService.js';
import Google  from '../src/authentication/strategy/Google.js';
import UsernamePassword from '../src/authentication/strategy/UsernamePassword.js';

async function Login(req) {
    const authenticationService = new AuthenticationService();

    switch (req.params.strategy) {
        case "username-password":
            authenticationService.setStrategy(new UsernamePassword());
            break;
        case 'google':
            authenticationService.setStrategy(new Google());
            break;
        default:
            throw new Error("Invalid authentication strategy");
    }

    return authenticationService.authenticate(req.body);
}

async function Register(req) {
    const authenticationService = new AuthenticationService();

    switch (req.params.strategy) {
        case "username-password":
            authenticationService.setStrategy(new UsernamePassword());
            break;
        case "google":
            authenticationService.setStrategy(new Google());
            break;
        default:
            throw new Error("Invalid authentication strategy");
    }

    return authenticationService.registerUser(req.body);
}

export { Login, Register }
