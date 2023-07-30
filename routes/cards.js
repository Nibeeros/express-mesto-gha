const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// создать карточку
router.post('/cards', createCard);

// вернуть все карточки
router.get('/cards', getCards);

// удалить карточку
router.delete('/cards/:cardId', deleteCardById);

// удалить лайк
router.delete('/cards/:cardId/likes', dislikeCard);

// добавить лайк
router.put('/cards/:cardId/likes', likeCard);

module.exports = router;
