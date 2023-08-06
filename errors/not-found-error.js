/* eslint-disable linebreak-style */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
// eslint-disable-next-line eol-last
module.exports = NotFoundError;