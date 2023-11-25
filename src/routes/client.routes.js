const router = require('express').Router();
const { client } = require('../controllers');
const verify_token = require('../middleware/verify_token');

// GET
router.get('/profile', verify_token, client.getData);
router.get('/appointments', verify_token, client.appointments);
router.get('/appointment', verify_token, client.appointment);
router.get('/favourites', verify_token, client.favourites);
router.get('/basket', verify_token, client.basket);

// POST
router.post('/master', verify_token, client.add_master);
router.post('/feedback', verify_token, client.post_feedback);
router.post('/appointment', verify_token, client.make_appointment);
router.post('/support', verify_token, client.send_support);

// PUT
router.put('/feedback', verify_token, client.update_feedback);
router.put('/update', verify_token, client.update_client);

// DELETE
router.delete('/delete', verify_token, client.delete);
router.delete('/appointment', verify_token, client.delete_appointment);
router.delete('/feedback', verify_token, client.delete_feedback);
router.delete('/master', verify_token, client.delete_master);

module.exports = router;
