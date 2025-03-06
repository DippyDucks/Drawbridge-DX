const API = "http://localhost:3000";

async function Login(params, strategy) {
    console.log("inside actions.Login");
    try {
        const response = await fetch(`${API}/login/${strategy}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params)
        });

        const data = await response.json();
        console.log("Login Response:", data);

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('clearance', data.clearance);

            window.location.href = 'success.html';
        } 
        else {
            alert("Login failed: " + data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function Register(params, strategy) {
    try {
        const response = await fetch(`${API}/register/${strategy}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params)
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = 'index.html';
        } 
        else {
            alert("Register failed: " + data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export {Login, Register}

