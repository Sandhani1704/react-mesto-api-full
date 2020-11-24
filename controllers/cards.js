const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
      }
      return res.send(card);
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

const createCard = (req, res) => {
  const { _id } = req.user;
  const {
    name, link,
  } = req.body;
  Card.create({
    // name, link, likes, createdAt, owner: _id,
    name, link, owner: _id,
  })
    // .then((card) => res.status(200).send({ data: card }))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      // console.log(err);
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'переданы некорректные данные в метод' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError({ message: 'Удалять можно только свои карточки' });
      }
      if (!card) {
        return res.status(404).send({ message: 'Нет карточки с таким id' });
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

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Нет карточки с таким id' });
    }
    return res.send(card);
  })
  .catch((err) => {
    // console.log(err);
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'невалидный id' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Нет карточки с таким id' });
    }
    return res.send(card);
  })
  .catch((err) => {
    // console.log(err);
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'невалидный id' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
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
