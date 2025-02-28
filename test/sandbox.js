/*

--------FRONT END--------

------USERNAME PASSWORD LOGIN FIELD-----
<div>
    <input></input>
    <input></input>
    <button onSubmit={() => actions.Login({username: username, password: password}, "username-password")}></button>
</div>

--------ACTIONS--------
require config

const API = config.API

func Login(params, strategy) {
    fetch(API + 'login/' + strategy {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: params // ?? JSON.stringify(params)
    })
    .then((res) => res.json())
    .catch((err) => {
        store.dispatch(alertActions.Error(err));
        console.log(err);
    });
}

----------BACK END-----------

--------CONTROLLER--------
router.post('/login/:strategy', [validation?], model.Login) //skip router functions? go straight to model, set up with req, res
// possibility of validation with express

--------MODEL-------
import AuthenticationService 
import (all the strategies)

func Login(req, res) {
    AuthenticationService = new AuthenticationService()

    switch(req.params.strategy) {
        case "username-password" {
            AuthenticationService.setStrategy(new UsernamePassword());
        }
        case "google" {
            AuthenticationService.setStrategy(new SocialMedia(google)); //maybe social media constructor should set the specific one
        }
    }

    return AuthenticationService.authenticate(req.body.params);
}

*/