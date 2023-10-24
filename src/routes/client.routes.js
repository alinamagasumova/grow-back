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
router.post('/addFavouriteMaster', verify_token, client.add_master);
router.post('/postFeedback', verify_token, client.post_feedback);
router.post('/makeAppointment', verify_token, client.make_appointment);

// PUT
router.put('/updateFeedback', verify_token, client.update_feedback);
router.put('/update', verify_token, client.update_client);

// DELETE
router.delete('/delete', verify_token, client.delete);
router.delete('/deleteAppointment', verify_token, client.delete_appointment);
router.delete('/deleteFeedback', verify_token, client.delete_feedback);
router.delete('/deleteFavouriteMaster', verify_token, client.delete_master);

module.exports = router;