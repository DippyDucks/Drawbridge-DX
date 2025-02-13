import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';

class UsernamePassword extends AuthenticationStrategyInterface {
    /**
     * concrete method
     */
    authenticate(username, password) {
        // TODO: SALT THE PASSWORD??
        // TODO: ORM 
        // TODO: RETURN THE USER (or true or false?)
    }
  
}

export default UsernamePassword;