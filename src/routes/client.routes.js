const router = require('express').Router();
const { client } = require('../controllers');
const verify_token = require('../middleware/verify_token');

router.get('/profile', verify_token, client.getData);
router.get('/appointments', verify_token, client.appointments);
// router.get('/favourites', verify_token, client.favourites);
// router.get('/basket', verify_token, client.basket);
router.delete('/deleteClient', verify_token, client.delete);

module.exports = router;