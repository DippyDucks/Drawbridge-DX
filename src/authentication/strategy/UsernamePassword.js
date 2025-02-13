import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';

class UsernamePassword extends AuthenticationStrategyInterface {
    //should have constructure where it takes the database connection class, or it just takes the config. first option is better for OOP
    //use ORM class for the constructor
    /**
     * concrete method
     */
    authenticate(params) {
        // TODO: SALT THE PASSWORD??
        // TODO: ORM 
        // TODO: RETURN THE USER (or true or false?)
    }
  
}

export default UsernamePassword;