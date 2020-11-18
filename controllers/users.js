const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка ${err}` }));
};

const getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => {
      // console.log(err);
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'невалидный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => User.create({
      name: 'Жак-Ив Кусто',
      about: 'Исследователь',
      avatar: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      email,
      password: hash, // записываем хеш в базу
    }))
    // User.create({ name, about, avatar, email, password })
    .then((user) => res.status(200).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'переданы некорректные данные в метод' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  // User.findByIdAndUpdate({ _id: req.user._id }, { name, about, avatar })
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    // .then((user) => res.status(200).send(user))
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'переданы некорректные данные в метод' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  // User.findByIdAndUpdate({ _id: req.user._id }, { name, about, avatar })
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    // .then((user) => res.status(200).send(user))
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'переданы некорректные данные в метод' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  // User.findOne({ email })
  //   .then((user) => {
  //     if (!user) {
  //       Promise.reject(new Error('Неправильные почта или пароль'));
  //     }
  //     return bcrypt.compare(password, user.password);
  //   })
  // then((matched) => {
  //   if (!matched) {
  //     Promise.reject(new Error('Неправильные почта или пароль'));
  //   }
  //   res.send({ message: 'Все верно!' })
  // })
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // В пейлоуд токена следует записывать только свойство _id, содержащее идентификатор пользователя
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token })
    })
    .catch((err) => {
      res
        .status(401)
      send({ message: err.message })
    })
}

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((userById) => {
      if (userById === null) {
        throw new NotFoundError('Пользователя нет в базе данных');
      }
      res
        .status(200)
        .send(userById);
    })

    .catch(() => {
      throw new NotFoundError('Пользователя нет в базе данных');
    })

    .catch(next);
};


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getUserInfo,
};
