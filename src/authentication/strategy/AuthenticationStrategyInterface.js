/**
 * @author - JC Ho & Rebecca Novis
 */

/**
 * Interface for Authentication Strategies
 */
class AuthenticationStrategyInterface {
    /**
     * Constructor to allow injection of database configuration.
     */
    constructor(ormInstance) {
        this.orm = ormInstance;
    }

    /**
     * Authenticate the user and log them in
     * @param {*} params - JSON 
     * @returns true if user exists, false if not or other error
     */
    authenticate(params) {
        throw new error("please use a class that implements this interface");
    }

    refreshAuthToken() {
        throw new error("please use a class that implements this interface");
    }

    registerUser(params){
        throw new error("please use a class that implements this interface");
    }

    logOutUser(){
        throw new error("please use a class that implements this interface");
    }

}

export default AuthenticationStrategyInterface;