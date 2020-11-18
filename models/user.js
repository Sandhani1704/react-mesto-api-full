const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^http[s]?:\/\/\w+/.test(v);
      },
      message: 'Ошибка в ссылке',
    },
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
