const router = require('express').Router();
const { auth } = require('../controllers');

router.post('/registration', auth.registration);
router.post('/loginEmail', auth.login_email);

// router.post('/loginPhone', auth.login_phone);
// router.post('/loginPhone/verify', auth.verify);

module.exports = router;
