const router = require('express').Router(); // создали роутер
const auth = require('../middlewares/auth');

const {
  getUsers, getUser, getUserInfo, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUser);

// router.post('/users', createUser);
router.get('/users/me', auth, getUserInfo); // возвращает информацию о текущем пользователе

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router; // экспортировали роутер
