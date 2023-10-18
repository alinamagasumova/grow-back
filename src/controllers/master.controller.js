const { models: { Master, Appointment, Product, Service, Subservice, Calendar_slot }} = require('../../dbConfigs/db').sequelize;
function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
}

class MasterController {
    // GET


    // POST
    

    // PUT


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
            const result = await Appointment.destroy({ where: { id: id_appointment }});
            // notification for client
            if (result) return status_handler(res, 200, 'Deleted successfully');  
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