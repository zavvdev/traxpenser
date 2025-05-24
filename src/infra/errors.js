export class AppError extends Error {
  /**
   * @param {string} message
   * @param {(object | undefined)} response
   */
  constructor(message, payload = {}) {
    super(message);
    this.name = "AppError";
    this.payload = payload || {};
  }
}
