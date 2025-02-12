import UsernamePassword from "./strategy/UsernamePassword" //importing strategies

//the context
class AuthenticationService {
    constructor() {
        this.strategy = new UsernamePassword()
    }

    /**
     * setting the strategy
     * @param {*} strategy - the new strategy we are setting. overrides the strategy set in the constructor
     */
    setStrategy(strategy){
        this.strategy = strategy;  
    }

    /**
     * calls the set strategy's authentication method
     * @param {*} username 
     * @param {*} password 
     * @returns 
     */
    authenticate(username, password){
        return this.strategy.authenticate(username, password); 
    }
}

export default AuthenticationService;