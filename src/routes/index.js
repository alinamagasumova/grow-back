const router = require('express').Router();
const { get } = require('../controllers');

router.get('/salon', get.salon);
router.get('/tariffs', get.tariffs);
// router.get('/masterRate', get.rate);
// router.get('/cityMasters', get.city_masters);
// router.get('/feedback', get.feedback);
router.get('/image', get.image);

module.exports = router;