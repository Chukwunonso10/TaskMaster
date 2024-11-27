const express = require('express')
const register = require('../controllers/usercontrollers')
const login = require('../controllers/usercontrollers')

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


module.exports = router