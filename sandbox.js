/*

-----FRONT END-----
<div>
    <input></input>
    <input></input>
    <button></button>
</div>

------USER ACTIONS?------
import AuthenticationService 
import (all the strategies)

AuthenticationService = new AuthenticationService()

usernamePassword(username, password) {
    if config username.active == true { // where does this go????
        AuthenticationService.setStrategy(new UsernamePassword())
        AuthenticationService.authenticate(username, password)
    }
}

*/