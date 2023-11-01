const { Support_request } = require('../../dbConfigs/support_db');
const { models: { Client, baskets, Appointment, favourites, Feedback, Master, Product, Subservice, Calendar_slot, Service }} = require('../../dbConfigs/db').sequelize;
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
            const doNotNeed = ['id', 'Master', 'Submaster', 'iat', 'exp'];
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

    async favourites(req, res) {
        try {
            const id = req.clientInfo.id;
            const result = await Client.findAll({ where: { id: id }, include: [{ model: Master, as: 'favourite', attributes: ['salon_name', 'salon_longitude', 'salon_latitude'] }]})
            let parsed_data = JSON.parse(JSON.stringify(result))[0].favourite;
            if (parsed_data.length == 0) return status_handler(res, 404, 'no favourites')
            Object.keys(parsed_data).forEach(idx => {
                delete parsed_data[idx].favourites
            });
            return res.status(200).json(parsed_data);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async appointments(req, res) {
        try {
            const id = req.clientInfo.id
            const appointments = await Appointment.findAll({ where: { ClientId: id }, attributes: ['CalendarSlotId', 'id'], rawData: true });
            let appointments_list = [];
            for (const ap of appointments) {
                let slot = await Calendar_slot.findOne({ where: { id: ap.CalendarSlotId }, attributes: ['date'], rawData: true });
                if (new Date(slot.date) >= new Date().setHours(0)) appointments_list.push(ap.id);
            };
            if (appointments) return res.status(200).json(appointments_list);  
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async appointment(req, res) {
        try {
            const id = req.clientInfo.id
            const { id_appointment } = req.body;
            const appointment = await Appointment.findOne({ where: { id: id_appointment, ClientId: id }, attributes: ['confirmed', 'CalendarSlotId', 'SubserviceId'], rawData: true });
            const slot = await Calendar_slot.findOne({ where: { id: appointment.CalendarSlotId }, attributes: ['date', 'time'], include: [{ model: Master, attributes: ['salon_name'] }], rawData: true });
            const subservice = await Subservice.findOne({ where: { id: appointment.SubserviceId }, attributes: ['subservice_name', 'subservice_price'], include: [{ model: Service, attributes: ['service_name'] }], rawData: true });
            appointment.CalendarSlotId = slot;
            appointment.SubserviceId = subservice;
            if (appointment) return res.status(200).json(appointment);  
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async basket(req, res) {
        try {
            const { id_appointment } = req.body;
            const basket_elements = await Appointment.findOne({ where: { id: id_appointment }, include: [{ model: Product, attributes: ['product_name', 'product_description', 'product_price'] }], rawData: true });
            if (basket_elements) return res.status(200).json(basket_elements.Products);  
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    //  POST
    async add_master(req, res) {
        try {
            const { id_master } = req.body;
            const id = req.clientInfo.id;
            if (req.clientInfo.Master && id_master == req.clientInfo.Master.id) return status_handler(res, 400, 'You can not add yourself to favourites')
            const result = await favourites.create({ ClientId: id, MasterId: id_master });
            if (result) return status_handler(res, 201, 'Added successfully');
        } catch (e) {
            status_handler(res, 400, 'Post error', e);
        }
    }

    async post_feedback(req, res) {
        try {
            const { id_master, feedback_text, feedback_rate } = req.body;
            const id = req.clientInfo.id;
            if (req.clientInfo.Master && id_master == req.clientInfo.Master.id) return status_handler(res, 400, 'Can not post feedback to your own');
            const result = await Feedback.create({ ClientId: id, MasterId: id_master, rate: feedback_rate, feedback_text: feedback_text });
            if (result) return status_handler(res, 201, 'Added successfully');
        } catch (e) {
            status_handler(res, 400, 'Post error', e);
        }
    }

    async make_appointment(req, res) {
        try {
            const { id_master, id_slot, id_subservice, id_products } = req.body;
            const id = req.clientInfo.id;
            // checks
            if (req.clientInfo.Master && id_master == req.clientInfo.Master.id) return status_handler(res, 400, 'You can not make an appointment to yourself')
            const checkBusy = await Calendar_slot.findOne({ where: { id: id_slot }, rawData: true });
            if (checkBusy.busy) return status_handler(res, 400, 'Slot is busy');
            // create appointment
            const result = await Appointment.create({ ClientId: id, SubserviceId: id_subservice, CalendarSlotId: id_slot });
            // link and create basket
            let basket_obj = [];
            id_products.forEach(product => {
                let new_product_obj = { ProductId: product, AppointmentId: result.id };
                basket_obj.push(new_product_obj);
            });
            const basket_result = await baskets.bulkCreate(basket_obj, { validate: true, ignoreDuplicates: true });
            // change slot state
            const slot = await Calendar_slot.update({busy: true}, { where: { id: id_slot }});
            // notification to master
            if (result && basket_result && slot) return status_handler(res, 201, 'Made successfully');
        } catch (e) {
            status_handler(res, 400, 'Post error', e);
        }
    }

    async send_support (req, res) {
        try {
            const id = req.clientInfo.id;
            const { message } = req.body;
            const result = await Support_request.create({ message: message, client_id: id });
            if (result) return res.status(201).json(result);
        } catch (e) {
            status_handler(res, 400, 'POST error', e);
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
            const { new_feedback, id_feedback } = req.body;
            const result = await Feedback.update(new_feedback, { where: { id: id_feedback } });
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
            const appointment = await Appointment.findOne({ where: { id: id_appointment }, attributes: ['CalendarSlotId'], rawData: true });
            const result = await Appointment.destroy({ where: { id: id_appointment } });
            const slot = await Calendar_slot.update({busy: false}, { where: { id: appointment.CalendarSlotId } });
            // notification for master
            if (result && slot) return status_handler(res, 200, 'Deleted successfully');  
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
            if (req.clientInfo.Master && req.clientInfo.Master.id == id_master) return status_handler(res, 400, 'You can not choose an id of yours'); 
            const result = await favourites.destroy({ where: { MasterId: id_master, ClientId: id }});
            if (result) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }
};

module.exports = new ClientController();