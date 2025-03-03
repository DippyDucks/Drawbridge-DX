
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

    /**
     * calls the set strategy's registerUser method
     * @param {*} params - json with needed registration info ie. email, username, password
     * @returns 
     */
    registerUser(params){
        return this.strategy.registerUser(params); 
    }

    /**
     * calls the set strategy's logoutUser method
     * @returns 
     */
    logOutUser(){
        return this.strategy.logOutUser(); 
    }
}

export default AuthenticationService;