const router = require('express').Router();
const { get } = require('../controllers');

router.get('/salon', get.salon);
router.get('/tariffs', get.tariffs);
router.get('/masterRate', get.rate);
router.get('/feedback', get.feedback);
router.get('/feedbacks', get.feedbacks_from);
router.get('/dateSlots', get.date_slots);
router.get('/monthStatuses', get.month_statuses);
router.get('/masters', get.masters);
router.get('/image', get.photo);

module.exports = router;