import UsernamePassword from "./strategy/UsernamePassword" //importing strategies

//the context
class AuthenticationService {
    constructor() {
        this.strategy = null;
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
     * @param {*} params - json with needed login info. ie. username + password
     * @returns 
     */
    authenticate(params){
        return this.strategy.authenticate(params); 
    }
}

export default AuthenticationService;