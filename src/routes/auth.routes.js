const router = require('express').Router();
const { auth } = require('../controllers');

router.post('/registration', auth.registration);
router.post('/loginEmail', auth.login_email);
// router.post('/sendCode', auth.);
// router.post('/verifyCode', auth.);

module.exports = router;
