const router = require('express').Router(); // создали роутер

const {
  getUsers, getUser, createUser, updateUser, updateUserAvatar, login,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUser);

// router.post('/users', createUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router; // экспортировали роутер
