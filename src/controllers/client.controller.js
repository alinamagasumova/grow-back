const { models: { Client, Basket, Appointment }} = require('../../dbConfigs/db').sequelize;
function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
}

class ClientController {

    async getData(req, res) {
        try {
            const client = req.clientInfo.this_client;
            const keys = Object.keys(client);
            const doNotNeed = ['id', 'password', 'MasterId', 'SubmasterId'];
            let data = {};
            keys.forEach(key => {
                if (!doNotNeed.includes(key)) {
                    data[key] = client[key];
                }
            });
            if (client) return res.status(200).json(data);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async appointments(req, res) {
        try {
            const id = req.clientInfo.this_client.id;
            const appointments_list = await Appointment.findAll({where: {client_id: id}});
            console.log(appointments_list);
            if (appointments_list) return res.status(200).json({appointment_list: appointments_list});  
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async basket(req, res) {
        try {
            const id = req.clientInfo.this_client.id;
            const appointment_id = req.body.appointment_id;
            const basket = Basket.findAll({where: {client_id: id}});
            console.log(appointments_list);
            if (appointments_list) return res.status(200).json({appointment_list: appointments_list});  
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }



    async delete (req, res) {
        try {
            const id = req.clientInfo.this_client.id;
            const result = await Client.destroy({ where: { id: id }});
            if (result) return status_handler(res, 200, 'Deleted successfully');;  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }
};

module.exports = new ClientController();