/**
 * @author - JC Ho & Rebecca Novis
 */

/**
 * Interface for Authentication Strategies
 */
class AuthenticationStrategyInterface {

    /**
     * Authenticate the user and log them in
     * @param {*} params - JSON 
     * @returns true if user exists, false if not or other error
     */
    authenticate(params) {
        throw new error("please use a class that implements this interface");
        //TODO: get user from database
        //TODO: if user exists return true
        //TODO: if not, return false
    }

    refreshAuthToken() {
        throw new error("please use a class that implements this interface");
    }

    registerUser(){
        throw new error("please use a class that implements this interface");
    }

    logOutUser(){
        throw new error("please use a class that implements this interface");
    }

}

export default AuthenticationStrategyInterface;