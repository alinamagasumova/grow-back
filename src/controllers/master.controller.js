const { models: { Master, Appointment, Product, Service, Subservice, Calendar_slot, Tariff_status, Tariff }} = require('../../dbConfigs/db').sequelize;
function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
}

class MasterController {
    // GET
    async tariff_state (req, res) {
        try {
            const id_tariff = req.clientInfo.Master.TariffId;
            const id_tariff_status = req.clientInfo.Master.TariffStatusId;
            const status_result = await Tariff_status.findOne({where: {id : id_tariff_status}, attributes: ['tariff_status'], raw: true});
            let tariff = await Tariff.findOne({where: {id : id_tariff}, attributes: ['tariff_name'], raw: true});
            if (!tariff) tariff = { tariff: 'none'};
            if (status_result && tariff) return res.status(200).json(Object.assign(tariff, status_result)); 
        } catch (e) {
            return status_handler(res, 400, 'Get error', e);
        }
    }

    // POST
    async create_service (req, res) {
        try {
            const id = req.clientInfo.Master.id;
            const { service_name } = req.body;
            const result = await Service.create({service_name: service_name, MasterId: id});
            if (result) return status_handler(res, 201, 'Created successfully')
        } catch (e) {
            return status_handler(res, 400, 'Post error', e);
        }
    }

    async create_subservice (req, res) {
        try {
            const { subservice_name, price, id_service } = req.body;
            const result = await Subservice.create({ subservice_name: subservice_name, ServiceId: id_service, subservice_price: price });
            if (result) return status_handler(res, 201, 'Created successfully')
        } catch (e) {
            return status_handler(res, 400, 'Post error', e);
        }
    }

    async create_product (req, res) {
        try {
            const id = req.clientInfo.Master.id;
            const { product_name, description, price } = req.body;
            const products = await Product.findAll({ where: { MasterId: id }, rawData: true });
            console.log(products.length);
            const result = await Product.create({ product_name: product_name, MasterId: id, product_price: price, product_description: description });
            if (result) return status_handler(res, 201, 'Created successfully')
        } catch (e) {
            return status_handler(res, 400, 'Post error', e);
        }
    }

    async create_slot (req, res) {
        try {
            const id = req.clientInfo.Master.id;
            const { date, time } = req.body;
            if (new Date(date) >= new Date().setHours(0)) { 
                if (time <= new Date().toLocaleTimeString()) return status_handler(res, 400, 'invalid Time');
            } else { return status_handler(res, 400, 'invalid Data') }
            const result = await Calendar_slot.create({ date: date, time: time, MasterId: id });
            if (result) return status_handler(res, 201, 'Created successfully')
        } catch (e) {
            return status_handler(res, 400, 'Post error', e);
        }
    }

    // PUT
    async update_salon (req, res) {
        try {
            // what about changing tariff_status and tariff, photos of salon
            const { data } = req.body;
            const id = req.clientInfo.Master.id;
            const result = await Master.update(data, { where: { id: id } });
            if (result) return status_handler(res, 201, 'Updated successfully');
        } catch (e) {
            status_handler(res, 400, 'PUT error', e);
        }
    }

    async update_service (req, res) {
        try {
            const { data, id_service } = req.body;
            const result = await Service.update(data, { where: { id: id_service } });
            if (result) return status_handler(res, 201, 'Updated successfully');
        } catch (e) {
            status_handler(res, 400, 'PUT error', e);
        }
    }

    async update_subservice (req, res) {
        try {
            const { data, id_subservice } = req.body;
            const result = await Subservice.update(data, { where: { id: id_subservice } });
            if (result) return status_handler(res, 201, 'Updated successfully');
        } catch (e) {
            status_handler(res, 400, 'PUT error', e);
        }
    }

    async update_product (req, res) {
        try {
            const { data, id_product } = req.body;
            const result = await Product.update(data, { where: { id: id_product } });
            if (result) return status_handler(res, 201, 'Updated successfully');
        } catch (e) {
            status_handler(res, 400, 'PUT error', e);
        }
    }

    async update_slot (req, res) {
        try {
            const { status, id_slot } = req.body;
            const result = await Calendar_slot.update(status, { where: { id: id_slot } });
            if (result) return status_handler(res, 201, 'Updated successfully');
        } catch (e) {
            status_handler(res, 400, 'PUT error', e);
        }
    }

    async update_appointment (req, res) {
        try {
            const { status, id_appointment } = req.body;
            const result = await Appointment.update(status, { where: { id: id_appointment } });
            // notificatiom for client
            if (result) return status_handler(res, 201, 'Updated successfully');
        } catch (e) {
            status_handler(res, 400, 'PUT error', e);
        }
    }

    // DELETE
    async delete (req, res) {
        try {
            const id = req.clientInfo.Master.id;
            const result = await Master.destroy({ where: { id: id }});
            if (result) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
           return status_handler(res, 400, 'Delete error', e);
        }
    }

    async delete_appointment (req, res) {
        try {
            const { id_appointment } = req.body;
            const appointment = await Appointment.findOne({ where: { id: id_appointment }, attributes: ['CalendarSlotId'], rawData: true });
            const result = await Appointment.destroy({ where: { id: id_appointment } });
            const slot = await Calendar_slot.update({busy: false}, { where: { id: appointment.CalendarSlotId } });
            // notification for client
            if (result && slot) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }

    async delete_product (req, res) {
        try {
            const { id_product } = req.body;
            const result = await Product.destroy({ where: { id: id_product }});
            if (result) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }

    async delete_service (req, res) {
        try {
            const { id_service } = req.body;
            const result = await Service.destroy({ where: { id: id_service }});
            if (result) return status_handler(res, 200, 'Deleted successfully');  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }

    async delete_subservice (req, res) {
        try {
            const { id_subservice } = req.body;
            const result = await Subservice.destroy({ where: { id: id_subservice }});
            if (result) return status_handler(res, 200, 'Deleted successfully');;  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }

    async delete_slot (req, res) {
        try {
            const { id_slot } = req.body;
            const result = await Calendar_slot.destroy({ where: { id: id_slot }});
            if (result) return status_handler(res, 200, 'Deleted successfully');;  
        } catch (e) {
            status_handler(res, 400, 'Delete error', e);
        }
    }
}

module.exports = new MasterController();