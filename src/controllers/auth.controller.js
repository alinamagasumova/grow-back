const { models: { Client, Master, Submaster }} = require('../../dbConfigs/db').sequelize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
}

class AuthController {
    async registration (req, res) {
        try {
            let {phone, name, email, password, isMaster} = req.body;
            name = name.split(' ');
            password = password.replace(/ /g, '');
            if (!password && password.length < 5) status_handler(res, 411, 'Enter password');

            let resultMaster = true
            const resultClient = await Client.create({first_name: name[0], last_name: name[1], email: email, phone_number: phone, password: password});
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

    async login_email (req, res) {
        try {
            const { email, password } = req.body;

            const this_client = await Client.findOne({ where: {email: email.toLowerCase()}, include: [Master, Submaster]});
            if (!this_client) return status_handler(res, 404, 'No sush user');
            
            const valid_password = bcrypt.compareSync(password, this_client.password);
            if (!valid_password) return status_handler(res, 400, 'Password incorrect');

            const keys = Object.keys(this_client.toJSON());
            const doNotNeed = ['password'];
            let client_info = {};
            keys.forEach(key => {
                if (!doNotNeed.includes(key)) {
                    client_info[key] = this_client[key];
                }
            });
            let access_token = jwt.sign(client_info, process.env.ACCESS_TOKEN, {expiresIn: '7d'});
            return res.status(200).json({ access_token: access_token}); 
        } catch (e) {
            status_handler(res, 401, 'Login error', e);
        }
    }

    async login_phone (req, res) {
        try {
            const { phone, code } = req.body;
            const valid_code = req.valid_code;
            console.log(valid_code);
            const this_client = await Client.findOne({ where: {phone: phone}, include: [Master, Submaster]});
            if (!this_client) return status_handler(res, 404, 'No sush user');
            if (code != valid_code) return status_handler(res, 400, 'code is incorrect');

            const keys = Object.keys(this_client.toJSON());
            const doNotNeed = ['password'];
            let client_info = {};
            keys.forEach(key => {
                if (!doNotNeed.includes(key)) {
                    client_info[key] = this_client[key];
                }
            });
            let access_token = jwt.sign(client_info, process.env.ACCESS_TOKEN, {expiresIn: '7d'});
            return res.status(200).json({ access_token: access_token}); 
        } catch (e) {
            status_handler(res, 401, 'Login error', e);
        }
    }
};

module.exports = new AuthController();