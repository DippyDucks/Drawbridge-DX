class AccountExists extends Error {
    constructor(message, type) {
      super();
      this.message = message;
      this.type = type || null;
      this.name = this.constructor.name;
      this.status = 409;
    }
}

export { AccountExists }