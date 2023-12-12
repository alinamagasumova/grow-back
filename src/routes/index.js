const router = require('express').Router();
const { api } = require('../controllers');

router.get('/salons', api.salons);
router.get('/salon/:id_master', api.salon);
router.get('/tariffs', api.tariffs);
router.get('/masterRate/:id_master', api.rate);
router.get('/feedback/:id', api.feedback);
router.get('/feedbacks', api.feedbacks_from);
router.get('/dateSlots', api.date_slots);
router.get('/monthStatuses', api.month_statuses);
router.get('/salonsLocation', api.salons_location);
router.get('/image/:id', api.photo);
router.get('/subservice/:id', api.subservice);
router.get('/clientInfo/:id', api.client);
router.get('/slot/:id', api.slot);

module.exports = router;
