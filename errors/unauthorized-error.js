/* eslint-disable linebreak-style */
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}
// eslint-disable-next-line eol-last
module.exports = UnauthorizedError;