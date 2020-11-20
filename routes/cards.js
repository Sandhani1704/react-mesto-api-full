const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, getCardById, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^http[s]?:\/\/\w+/),
  }).unknown(true),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }).unknown(true),
}), deleteCard);

router.get('/cards/:cardId', getCardById);

router.put('/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex(),
    }).unknown(true),
  }), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
