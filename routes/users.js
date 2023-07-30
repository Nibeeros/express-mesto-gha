const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// вернуть пользователя по _id
router.get('/users/:userId', getUserById);

// вернуть всех пользователей
router.get('/users', getUsers);

// создать пользователя
router.post('/users', createUser);

// обновить аватар
router.patch('/users/me/avatar', updateAvatar);

// обновить профиль
router.patch('/users/me', updateUser);

module.exports = router;
