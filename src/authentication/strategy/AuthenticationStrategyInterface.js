/**
 * @author - JC Ho & Rebecca Novis
 */

/**
 * Interface for Authentication Strategies
 */
class AuthenticationStrategyInterface {

    /**
     * Authenticate the user and log them in
     * @param {*} username 
     * @param {*} password 
     * @returns true if user exists, false if not or other error
     */
    authenticate(username, password) {
        //TODO: get user from database
        //TODO: if user exists return true
        //TODO: if not, return false
    }

    refreshAuthToken() {

    }

}

export default AuthenticationStrategyInterface;