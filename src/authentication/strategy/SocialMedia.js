import AuthenticationStrategyInterface from './AuthenticationStrategyInterface.js';
import OAuth2Client from './google-auth-library';
import config from 'config';
const client = new OAuth2Client();
const ClientID = config.get('AuthenticateStrategies.SocialMedia.Google.Client_ID');

class Google extends AuthenticationStrategyInterface {
    /**
     * concrete method
     */
    authenticate(params) {
        const token = params.token;
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: ClientID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend. will want to get this from the config probably 
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            // If the request specified a Google Workspace domain:
            // const domain = payload['hd'];
          }
          verify().catch(console.error);
    }

    refreshAuthToken() {
        //check if token still good, if it  is, just return, if not, refresh it.

    }

    registerUser(){
        
    }

    logOutUser(params){
        const auth2 = params.auth2;
        auth2.signOut().then(function () {
            console.log('User signed out.');
            //any other post-sign-out actions, like changing to sign in page?
          });
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

export {Google, Instagram, Facebook};