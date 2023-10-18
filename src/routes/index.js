const router = require('express').Router();
const { get } = require('../controllers');

router.get('/image', (req, res) => res.send('hi'));

module.exports = router;