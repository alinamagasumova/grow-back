const router = require('express').Router();
const { api } = require('../controllers');

router.get('/salon', api.salon);
router.get('/tariffs', api.tariffs);
router.get('/masterRate', api.rate);
router.get('/feedback', api.feedback);
router.get('/feedbacks', api.feedbacks_from);
router.get('/dateSlots', api.date_slots);
router.get('/monthStatuses', api.month_statuses);
router.get('/masters', api.masters);
router.get('/image', api.photo);

module.exports = router;