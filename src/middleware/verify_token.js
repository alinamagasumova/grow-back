const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.sendStatus(403);
    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.clientInfo = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ msg: 'do not have access' });
  }
};
