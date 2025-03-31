const API = "http://localhost:3000";

async function Login(params, strategy) {
    const response = await fetch(`${API}/login/${strategy}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        const errorData = await response.json(); 
        if (errorData.name === 'UserDoesNotExist') {
            alert(errorData.message);
            if(errorData.data){
                await Register(errorData.data, strategy);
            }
        }
        else if (errorData.name === 'IncorrectPassword') {
            alert(errorData.message);
        }
        else if(errorData.name === 'BadToken'){
            alert(errorData.message);
        }
        else {
            alert("Unknown error: ", errorData.message);
        }
    }
    else {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('clearance', data.clearance);
        window.location.href = 'success.html';
    }
}

async function Register(params, strategy) {
    const response = await fetch(`${API}/register/${strategy}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        const errorData = await response.json(); 
        if (errorData.name === 'AccountExists') {
            if (errorData.type === 'Username') {
                alert(errorData.message);
            }
            else if (errorData.type === 'Email') {
                alert(errorData.message);
                // prompt a login
            }
        }
    }
    else {
        const data = await response.json();
        window.location.href = 'index.html';
    }
}

export {Login, Register}


document.addEventListener("DOMContentLoaded", () => {
    // Check if the login button exists (for index.html)
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const params = { username, password };
            Login(params, "username-password");
        });
    }

    // Check if the register button exists (for register.html)
    const registerButton = document.getElementById("registerButton");

    if (registerButton) {
        registerButton.addEventListener("click", () => {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const email = document.getElementById("email").value;

            const params = { username, password, email };
            Register(params, "username-password");
        });
    }
    const googleRegisterButton = document.getElementById("googleRegisterButton");
    if (googleRegisterButton) {
        googleRegisterButton.addEventListener("click", () => {
            const userID = document.getElementById("userID").value;
            const email = document.getElementById("email").value;
           // const username = document.getElementById("username").value;
            //const password = document.getElementById("password").value;

            const params = { userID, email, username, password };
            Register(params, "google");
        });
    }
});
