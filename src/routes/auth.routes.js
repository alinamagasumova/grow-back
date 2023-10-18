const router = require('express').Router();
const { auth } = require('../controllers');

router.post('/registration', auth.registration);
router.post('/loginEmail', auth.login_email);

// router.get('/clients', auth.getAll);

module.exports = router;