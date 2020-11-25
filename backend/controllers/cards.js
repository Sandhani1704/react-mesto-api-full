const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const getCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return res.send(card);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const {
    name, link,
  } = req.body;
  Card.create({
    // name, link, likes, createdAt, owner: _id,
    name, link, owner: _id,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      // console.log(err);
      if (err.name === 'ValidationError') {
        throw new BadRequestError('переданы некорректные данные в метод');
      } else next(err);
    });
};

const deleteCard = (req, res, next) => {
  // Card.findByIdAndRemove(req.params.cardId)
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        // throw new ForbiddenError('Удалять можно только свои карточки');
        throw new ForbiddenError('Удалять можно только свои карточки');
      }
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      // return res.send(card);
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    // .catch((err) => {
    //   // console.log(err);
    //   if (err.name === 'CastError') {
    //     res.status(400).send({ message: 'невалидный id' });
    //   } else {
    //     res.status(500).send({ message: 'На сервере произошла ошибка' });
    //   }
    // });
    .catch(next);
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      // return res.status(404).send({ message: 'Нет карточки с таким id' });
      throw new NotFoundError('Нет карточки с таким id');
    }
    return res.send(card);
  })
  .catch((err) => {
    // console.log(err);
    if (err.name === 'CastError') {
      throw new BadRequestError('невалидный id');
      // res.status(400).send({ message: 'невалидный id' });
    } else {
      next(err);
    }
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Нет карточки с таким id');
    }
    return res.send(card);
  })
  .catch((err) => {
    // console.log(err);
    if (err.name === 'CastError') {
      throw new BadRequestError('невалидный id');
    } else {
      next(err);
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  getCardById,
  likeCard,
  dislikeCard,
};
