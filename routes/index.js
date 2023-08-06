const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const signinRouter = require('./singin');
const signupRouter = require('./singup');
const auth = require('../middlewares/auth');
const NotFoundErr = require('../errors/not-found-error');

router.use(signinRouter);
router.use(signupRouter);

router.use(auth);

router.use(usersRouter);
router.use(cardsRouter);

router.use('*', () => {
  throw new NotFoundErr('Страница не найдена');
});

module.exports = router;
