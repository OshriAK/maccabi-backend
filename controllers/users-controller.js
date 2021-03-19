const fs = require('fs');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const getUsers = (req, res, next) => {
  fs.readFile('./db/DB.json', (err, data) => {
    if (err)
      throw new HttpError(
        'Cant read right from the DB, please try later.',
        500
      );
    const users = JSON.parse(data);
    res.json({ users: users });
  });
};

const addUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { name, email, age } = req.body;
  const newUser = {
    name,
    email,
    age,
  };

  const data = fs.readFileSync('./db/DB.json');
  const currentDB = JSON.parse(data);

  if (currentDB) {
    const identifiedUser = currentDB.find((u) => u.email === email);
    if (identifiedUser) {
      throw new HttpError('The user already existed, try new email.', 422);
    }
  }

  currentDB.push(newUser);

  let newData = JSON.stringify(currentDB, null, 2);

  fs.writeFile('./db/DB.json', newData, (err) => {
    if (err)
      throw new HttpError('Cant write to DB right now, please try later.', 500);
  });

  res.status(201).json({ message: 'Successfully added a new user' });
};

exports.getUsers = getUsers;
exports.addUser = addUser;
