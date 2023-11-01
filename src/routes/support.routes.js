const router = require('express').Router();
const { support } = require('../controllers');

router.get('/requests', support.getRequests);

module.exports = router;