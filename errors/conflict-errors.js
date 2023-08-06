/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}
// eslint-disable-next-line eol-last
module.exports = ConflictError;