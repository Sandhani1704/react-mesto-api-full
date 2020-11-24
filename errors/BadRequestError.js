class BadRequestError extends Error { // Ошибка неверного запроса
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

module.exports = BadRequestError;
