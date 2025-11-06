const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the API!',
    timestamp: new Date().toISOString()
  });
});

router.post('/login', apiController.login);

router.post('/signup', apiController.createUser);

module.exports = router;