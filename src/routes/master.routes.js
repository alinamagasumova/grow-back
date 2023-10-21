const router = require('express').Router();
const { master } = require('../controllers');
const verify_token = require('../middleware/verify_token');

// GET
router.get('/tariff', verify_token, master.tariff_state);

// POST
router.post('/createService', verify_token, master.create_service);
router.post('/createSlot', verify_token, master.create_slot);
router.post('/createSubservice', verify_token, master.create_subservice);
router.post('/createProduct', verify_token, master.create_product);

// PUT
router.put('/update', verify_token, master.update_salon);
router.put('/updateSubservice', verify_token, master.update_subservice);
router.put('/updateService', verify_token, master.update_service);
router.put('/updateSlotStatus', verify_token, master.update_slot);
router.put('/updateAppointmentStatus', verify_token, master.update_appointment);
router.put('/updateProduct', verify_token, master.update_product);

// DELETE
router.delete('/delete', verify_token, master.delete);
router.delete('/deleteAppointment', verify_token, master.delete_appointment);
router.delete('/deleteProduct', verify_token, master.delete_product);
router.delete('/deleteService', verify_token, master.delete_service);
router.delete('/deleteSubservice', verify_token, master.delete_subservice);
router.delete('/deleteSlot', verify_token, master.delete_slot);

module.exports = router;