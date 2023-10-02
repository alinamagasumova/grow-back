const router = require('express').Router();
// const clientRouter = require('./client.routes');

router.get('/', (req, res) => res.status(200).send());

module.exports = router;