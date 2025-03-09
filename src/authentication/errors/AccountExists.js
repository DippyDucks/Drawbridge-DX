class AccountExists extends Error {
    constructor(message, type) {
      super(message);
      this.type = type || null;
      this.name = this.constructor.name;
    }
}

export default AccountExists;