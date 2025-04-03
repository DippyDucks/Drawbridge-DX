class SuccessfulLogin {
    constructor(message, token, clearance) {
        this.message = message || "Log in success."
        this.clearance = clearance;
        this.token = token;
        this.name = this.constructor.name;
    }
}

export { SuccessfulLogin }