const { models: { Client, Master }} = require('../../dbConfigs/db').sequelize;
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

            let resultClient; 
            let resultMaster = true;
            resultClient = await Client.create({first_name: name[0], last_name: name[1], email: email, phone_number: phone, password: password});
            if (isMaster) { 
                resultMaster = await Master.create();
                resultClient.setMaster(resultMaster);
            }
           

            if (resultClient) return status_handler(res, 201, 'Created successfully');
        } catch (e) {
            if (e.name == 'SequelizeValidationError') return status_handler(res, 406, e.errors[0].message);
            status_handler(res, 401, 'Registration error', e);
        }
    }

    async login_email (req, res) {
        try {
            const { email, password, isMaster } = req.body;

            const this_client = await Client.findOne({ where: {email: email.toLowerCase()}, include: Master});
            
            if (!this_client) return status_handler(res, 404, 'No sush user');

            const valid_password = bcrypt.compareSync(password, this_client.password);
            if (!valid_password) return status_handler(res, 400, 'Password incorrect');

            let role = 'client';
            if (this_client.master_id) role = "master"
            if (this_client.submaster_id) role = "submaster"

            let access_token = jwt.sign({this_client, role}, process.env.ACCESS_TOKEN, {expiresIn: '7d'});
            return res.status(200).json({ access_token: access_token}); 
        } catch (e) {
            status_handler(res, 401, 'Login error', e);
        }
    }
};

module.exports = new AuthController();