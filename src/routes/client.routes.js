const router = require('express').Router();
const { client } = require('../controllers');
const upload = require('../middleware/multer');
const verify_token = require('../middleware/verify_token');

// GET
router.get('/profile', verify_token, client.get_data);
router.get('/appointments', verify_token, client.appointments);
router.get('/appointment/:id_appointment', verify_token, client.appointment);
router.get('/favourites', verify_token, client.favourites);
router.get('/basket', verify_token, client.basket);

// POST
router.post('/master', verify_token, client.add_master);
router.post('/feedback', verify_token, client.post_feedback);
router.post('/appointment', verify_token, client.make_appointment);
router.post('/support', verify_token, client.send_support);
router.post('/photo', verify_token, upload.single('clientPhoto'), client.add_photo);

// PUT
router.put('/feedback', verify_token, client.update_feedback);
router.put('/update', verify_token, client.update_client);

// DELETE
router.delete('/delete', verify_token, client.delete);
router.delete('/appointment/:id', verify_token, client.delete_appointment);
router.delete('/feedback/:id', verify_token, client.delete_feedback);
router.delete('/master/:id_master', verify_token, client.delete_master);

module.exports = router;
