const { models: { Client }} = require('../../dbConfigs/db').sequelize;
const bcrypt = require('bcrypt');
const { generate_token } = require('../middleware/auth_token');

function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
}

class AuthController { 
    getAll (req, res) {
        Client.findAll()
        .then((data)=>res.send(JSON.stringify(data)))
        .catch(err=>console.error(err));
    }

    async registration (req, res) {
        try {
            const {password} = req.body;
            if (password && password != "" && password.length >=5) {
                const result = await Client.create(req.body);
                if (result) return res.sendStatus(201);
                // JWT
            }
            status_handler(res, 411, 'Enter password');
        } catch (e) {
            if (e.name == 'SequelizeValidationError') return status_handler(res, 406, e.errors[0].message);
            status_handler(res, 401, 'Registration error', e);
        }
    }

    async login (req, res) {
        try {
            const { email, password } = req.body;
            const this_client = await Client.findOne({ where: {email: email}});
            if (this_client) {
                bcrypt.compare(password, this_client.password, (err, valid) => {
                    if (err) throw err
                    if (valid) {
                        // do master/submaster check and return jwt
                        return res.status(200).json({ access_token: generate_token(this_client)});
                    }
                    status_handler(res, 400, 'Password incorrect');
                })
            }
            status_handler(res, 404, 'No sush user');
        } catch (e) {
            status_handler(res, 401, 'Login error', e);
        }
    }
};

module.exports = new AuthController();