const jwt = require('jsonwebtoken');

function verify_token(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, client) => {
        if (err) return res.sendStatus(403);
        req.client = client;
        next()
    })
}

function generate_token(client) {
    return jwt.sign(client, process.env.ACCESS_TOKEN, {expiresIn: '10'});
}

module.exports = {verify_token, generate_token};