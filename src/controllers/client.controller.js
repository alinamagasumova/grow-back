const { models: { Client, Basket, Appointment, favourites }} = require('../../dbConfigs/db').sequelize;
function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
}

class ClientController {

    // GET
    async getData(req, res) {
        try {
            const client = req.clientInfo;
            const keys = Object.keys(client);
            const doNotNeed = ['id'];
            let data = {};
            keys.forEach(key => {
                if (!doNotNeed.includes(key)) {
                    data[key] = client[key];
                }
            });
            delete data.Master.id;
            if (client) return res.status(200).json(data);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async favourites(req, res) {
        try {
            const id = req.clientInfo.id;
            const result = await favourites.findAll({ where: { clientId: id } })
            if (result) return res.status(200).json(result.toJSON());
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    // async appointments(req, res) {
    //     try {
    //         const id = req.clientInfo.id;
    //         const appointments_list = await Appointment.findOne({where: {client_id: id}});
    //         console.log(appointments_list.getCalendarSlot());
    //         if (appointments_list) return res.status(200).json({appointment_list: appointments_list});  
    //     } catch (e) {
    //         status_handler(res, 400, 'GET error', e);
    //     }
    // }

    // async basket(req, res) {
    //     try {
    //         const id = req.clientInfo.id;
    //         const appointment_id = req.body.appointment_id;
    //         const basket = Basket.findAll({where: {client_id: id}});
    //         console.log(appointments_list);
    //         if (appointments_list) return res.status(200).json({appointment_list: appointments_list});  
    //     } catch (e) {
    //         status_handler(res, 400, 'GET error', e);
    //     }
    // }

    //  POST
    async add_master(req, res) {
        try {
            const { id_master } = req.body;
            const id = req.clientInfo.id;
            console.log(id, id_master);
            const result = await favourites.create({ ClientId: id, MasterId: id_master });
            if (result) return status_handler(res, 201, 'Added successfully');
        } catch (e) {
            status_handler(res, 400, 'Post error', e);
        }
    }

    // PUT
    async update_client(req, res) {
        try {
            const { data } = req.body;
            const id = req.clientInfo.id;
            const result = await Client.update(data, { where: { id: id } });
            if (result) return status_handler(res, 201, 'Updated successfully');
        } catch (e) {
            status_handler(res, 400, 'PUT error', e);
        }
    }
    async update_feedback(req, res) {
        try {
            const { new_feedback, feedback_id } = req.body;
            const result = await Feedback.update(new_feedback, { where: { id: feedback_id } });
            if (result) return status_handler(res, 201, 'Updated successfully');
        } catch (e) {
            status_handler(res, 400, 'PUT error', e);
        }
    }

    // DELETE  
    async delete (req, res) {
        try {
            const id = req.clientInfo.id;
            const result = await Client.destroy({ where: { id: id }, onDelete: 'cascade '});
            if (result) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }

    async delete_appointment (req, res) {
        try {
            const { id_appointment } = req.body;
            const result = await Appointment.destroy({ where: { id: id_appointment }});
            // notification for master
            if (result) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }

    async delete_feedback (req, res) {
        try {
            const { id_feedback } = req.body;
            const result = await Feedback.destroy({ where: { id: id_feedback }});
            if (result) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }

    async delete_master (req, res) {
        try {
            const id = req.clientInfo.id;
            const { id_master } = req.body;
            if (id == id_master) return status_handler(res, 400, 'You can not choose an id of yours'); 
            const result = await favourites.destroy({ where: { MasterId: id_master, ClientId: id }});
            if (result) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }
};

module.exports = new ClientController();