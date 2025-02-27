import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';

class Google extends AuthenticationStrategyInterface {
    /**
     * concrete method
     */
    authenticate(params) {
        // 
    }

    refreshAuthToken() {
        
    }

    registerUser(){
        
    }

    logOutUser(){
        
    }
  
}

class Instagram extends AuthenticationStrategyInterface {
    /**
     * concrete method
     */
    authenticate(params) {
        // 
    }
    
    refreshAuthToken() {
        
    }

    registerUser(){
        
    }

    logOutUser(){
        
    }
  
}

class Facebook extends AuthenticationStrategyInterface {
    /**
     * concrete method
     */
    authenticate(params) {
        // 
    }

    refreshAuthToken() {
        
    }

    registerUser(){
        
    }

    logOutUser(){
        
    }
  
}

export default {Google, Instagram, Facebook};