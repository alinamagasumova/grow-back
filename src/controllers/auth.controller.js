const {
  models: { Client, Master, Submaster },
} = require('../../dbConfigs/db').sequelize;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
function status_handler(res, status, msg = '', err = false) {
  if (err) {
    console.log(err);
  }
  return res.status(status).json({ msg: msg });
}

function createJwt(client) {
  const keys = Object.keys(client.toJSON());
  const doNotNeed = ['password'];
  const client_info = {};
  keys.forEach((key) => {
    if (!doNotNeed.includes(key)) {
      client_info[key] = client[key];
    }
  });
  return jwt.sign(client_info, process.env.ACCESS_TOKEN, {
    expiresIn: '7d',
  });
}

class AuthController {
  async registration(req, res) {
    try {
      let { name, email, password, isMaster } = req.body;
      name = name.split(' ');
      password = password.replace(/ /g, '');
      if (!password && password.length < 5) status_handler(res, 411, 'Enter password');

      let resultMaster = true;
      const resultClient = await Client.create({
        first_name: name[0],
        last_name: name[1],
        email: email,
        password: password,
      });
      if (resultClient && isMaster) {
        resultMaster = await Master.create();
        resultClient.setMaster(resultMaster);
      }
      if (resultClient && resultMaster) return status_handler(res, 201, 'Created successfully');
    } catch (e) {
      if (e.name == 'SequelizeValidationError') return status_handler(res, 406, e.errors[0].message);
      status_handler(res, 401, 'Registration error', e);
    }
  }

  async login_email(req, res) {
    try {
      const { email, password } = req.body;
      const this_client = await Client.findOne({
        where: { email: email.toLowerCase() },
        include: [Master, Submaster],
      });
      if (!this_client) return status_handler(res, 404, 'No sush user');
      const valid_password = bcrypt.compareSync(password, this_client.password);
      if (!valid_password) return status_handler(res, 400, 'Password incorrect');

      const access_token = createJwt(this_client);
      return res.status(200).json({ access_token: access_token, id: this_client.id });
    } catch (e) {
      status_handler(res, 401, 'Login error', e);
    }
  }

  async login_phone(req, res) {
    try {
      const { phone } = req.body;
      const this_client = await Client.findOne({
        where: { phone: phone },
      });
      if (!this_client) return status_handler(res, 404, 'No sush user');

      // send phone to server, get otp
      const otp = '';
      const ttl = 2 * 60 * 1000;
      const expires = Date.now() + ttl;
      const data = `${phone}.${otp}.${expires}`;
      const hash = crypto.createHmac('sha32', process.env.HASH_KEY).update(data).digest('hex');
      const secretHash = `${hash}.${expires}`;
      return status_handler(res, 200, secretHash);
    } catch (e) {
      status_handler(res, 401, 'Login error', e);
    }
  }

  async verify(req, res) {
    try {
      const { phone, otp, secretHash } = req.body;
      const this_client = await Client.findOne({
        where: { phone: phone },
        include: [Master, Submaster],
      });

      const [hashValue, expires] = secretHash.split('.');
      if (Date.now() > parseInt(expires)) return status_handler(res, 400, 'Timeout');

      const data = `${phone}.${otp}.${expires}`;
      const newCalculatedHash = crypto.createHmac('sha32', process.env.HASH_KEY).update(data).digest('hex');
      if (newCalculatedHash === hashValue) return res.status(200).json({ access_token: createJwt(this_client) });
    } catch (e) {
      status_handler(res, 401, 'Invalid OTP. Please try again', e);
    }
  }
}

module.exports = new AuthController();
