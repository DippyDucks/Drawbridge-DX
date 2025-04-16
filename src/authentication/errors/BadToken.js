class BadToken extends Error {
    constructor(message) {
      super();
      this.message = message;
      this.name = this.constructor.name;
      this.status = 401;
    }
}

export {BadToken};