class UserDoesNotExist extends Error {
    constructor(message) {
      super();
      this.message = message;
      this.name = this.constructor.name;
      this.status = 404;
    }
}

export default UserDoesNotExist;