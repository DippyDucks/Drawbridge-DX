class UserDoesNotExist extends Error {
    constructor(message, data) {
      super();
      this.message = message;
      this.name = this.constructor.name;
      this.data = data || null;
      this.status = 404;
    }
}

export default UserDoesNotExist;