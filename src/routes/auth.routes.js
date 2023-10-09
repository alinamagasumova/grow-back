const router = require('express').Router();
const client = require('../controllers');

router.post('/registration', client.registration);
router.post('/login', client.login);
router.get('/clients', client.getAll);

module.exports = router;