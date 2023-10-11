const router = require('express').Router();
const { auth } = require('../controllers');

router.post('/registration', auth.registration);
router.post('/login', auth.login)

router.get('/clients', auth.getAll);

module.exports = router;