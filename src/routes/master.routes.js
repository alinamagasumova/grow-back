const router = require('express').Router();
const { master } = require('../controllers');
const upload = require('../middleware/multer');
const verify_token = require('../middleware/verify_token');

// GET
router.get('/tariff', verify_token, master.tariff_state);
router.get('/appointments', verify_token, master.appointments);

// POST
router.post('/photo', verify_token, upload.single('masterPhoto'), master.add_photo);
// router.post('/salonPhoto', verify_token, master.add_salon_photo);
router.post('/service', verify_token, master.create_service);
router.post('/slot', verify_token, master.create_slot);
router.post('/subservice', verify_token, master.create_subservice);
router.post('/product', verify_token, master.create_product);
router.post('/productPhoto/:id', verify_token, upload.single('productPhoto'), master.add_product_photo);

// PUT
router.put('/salon', verify_token, master.update_salon);
router.put('/subservice', verify_token, master.update_subservice);
router.put('/service', verify_token, master.update_service);
router.put('/slot', verify_token, master.update_slot);
router.put('/appointment', verify_token, master.update_appointment);
router.put('/product', verify_token, master.update_product);

// DELETE
router.delete('/delete', verify_token, master.delete);
// router.delete('/salonPhoto/:id', verify_token, master.delete_salonPhoto);
router.delete('/appointment/:id', verify_token, master.delete_appointment);
router.delete('/product/:id', verify_token, master.delete_product);
router.delete('/service/:id', verify_token, master.delete_service);
router.delete('/subservice/:id', verify_token, master.delete_subservice);
router.delete('/slot/:id', verify_token, master.delete_slot);

module.exports = router;
