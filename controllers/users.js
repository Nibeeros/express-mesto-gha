const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK_CODE,
  CREATED_CODE,
} = require('../utils/constants');
const NotFoundErr = require('../errors/not-found-error');
const BadRequestErr = require('../errors/bad-request-error');
const ConflictErr = require('../errors/conflict-errors');

const getAllUsers = (req, res, next) => User.find({})
  .then((users) => res.status(OK_CODE).send(users))
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((newUser) => {
          const { _id } = newUser;
          res.status(CREATED_CODE).send({
            name, about, avatar, email, _id,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictErr('Пользователь с таким email уже существует'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestErr('Пользователь не создан, переданы невалидные данные'));
          }
          return next(err);
        });
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь с таким id не найден');
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Пользователь не найден, некоректный id пользователя'));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('User not found');
      }
      return res.status(OK_CODE).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь с таким id не найден');
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Пользователь не обновлен, переданы невалидные данные'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь с таким id не найден');
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Аватар не обновлен, переданы невалидные данные'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      }).send({ token });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
  login,
};
