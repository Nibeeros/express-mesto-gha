const Card = require('../models/card');
const {
  OK_CODE,
  CREATED_CODE,
} = require('../utils/constants');
const NotFoundErr = require('../errors/not-found-error');
const BadRequestErr = require('../errors/bad-request-error');
const ForbiddenErr = require('../errors/forbidden-errors');

const getAllCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(OK_CODE).send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(CREATED_CODE).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Аватар не обновлен, переданы невалидные данные'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Карточка с таким id не найдена');
      }
      if (card.owner.toString() !== userId) {
        throw new ForbiddenErr('Можно удалять только свои карточки');
      }
      return Card.deleteOne(card)
        .then(() => res.status(OK_CODE).send(card))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestErr('Не получилось удалить'));
          }
          return next(err);
        });
    })
    .catch(next);
};

const putLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Карточка с таким id не найдена');
      }
      return res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Лайк не поставлен, некоректный id карточки'));
      }
      return next(err);
    });
};

const deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Карточка с таким id не найдена');
      }
      return res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Лайк не удален, некоректный id карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
