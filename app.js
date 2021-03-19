const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);
require('dotenv').config();

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

app.listen(process.env.PORT || 5000);
