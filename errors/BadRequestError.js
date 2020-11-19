class BadRequestError extends Error { // Ошибка неверного запроса
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;