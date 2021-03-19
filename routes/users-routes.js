const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/addUser',
  [
    check('name').isLength({ min: 2 }),
    check('email').normalizeEmail().isEmail(),
  ],
  usersController.addUser
);

module.exports = router;
