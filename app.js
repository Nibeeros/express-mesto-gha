const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouters = require('./routes/users');
const cardRouters = require('./routes/cards');
const { NOT_FOUND_ERROR } = require('./utils/errors');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
  });

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64c607a301c446b003f9dda7',
  };
  next();
});

app.use(userRouters);
app.use(cardRouters);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
