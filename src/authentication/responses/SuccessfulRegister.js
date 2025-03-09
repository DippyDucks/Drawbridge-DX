class SuccessfulRegister {
    constructor(message, user_id, email, username) {
      this.message = message || "Succesfully registered account.";
      this.user_id = user_id || null;
      this.email = email || "";
      this.username = username || "";
      this.name = this.constructor.name;
    }
}

export default SuccessfulRegister;