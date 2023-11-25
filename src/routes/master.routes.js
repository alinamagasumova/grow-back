const router = require('express').Router();
const { master } = require('../controllers');
const verify_token = require('../middleware/verify_token');

// GET
router.get('/tariff', verify_token, master.tariff_state);

// POST
router.post('/service', verify_token, master.create_service);
router.post('/slot', verify_token, master.create_slot);
router.post('/subservice', verify_token, master.create_subservice);
router.post('/product', verify_token, master.create_product);

// PUT
router.put('/salon', verify_token, master.update_salon);
router.put('/subservice', verify_token, master.update_subservice);
router.put('/service', verify_token, master.update_service);
router.put('/slot', verify_token, master.update_slot);
router.put('/appointment', verify_token, master.update_appointment);
router.put('/product', verify_token, master.update_product);

// DELETE
router.delete('/delete', verify_token, master.delete);
router.delete('/appointment', verify_token, master.delete_appointment);
router.delete('/product', verify_token, master.delete_product);
router.delete('/service', verify_token, master.delete_service);
router.delete('/subservice', verify_token, master.delete_subservice);
router.delete('/slot', verify_token, master.delete_slot);

module.exports = router;
