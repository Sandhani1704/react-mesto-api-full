const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    // required: true,
    validate: {
      validator(v) {
        return /^http[s]?:\/\/\w+/.test(v);
      },
      message: 'Ошибка в ссылке',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    }
  },

  password: {
    type: String,
    required: true,
    minlength: 8
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользовател по почте
  return this.findOne({ email }) // this — это модель User
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // нашелся - сравниваем пароль
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        })
    })

};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
