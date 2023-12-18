const {
  models: { Master, Appointment, Product, Service, Subservice, Calendar_slot, Tariff_status, Tariff },
} = require('../../dbConfigs/db').sequelize;
const { status_handler, checkData, checkLimit } = require('../middleware/helpers');

class MasterController {
  // GET
  async tariff_state(req, res) {
    try {
      const id_tariff = req.clientInfo.Master.TariffId;
      const id_tariff_status = req.clientInfo.Master.TariffStatusId;
      const status_result = await Tariff_status.findOne({
        where: { id: id_tariff_status },
        attributes: ['tariff_status'],
        raw: true,
      });
      let tariff = await Tariff.findOne({
        where: { id: id_tariff },
        attributes: ['tariff_name'],
        raw: true,
      });
      if (!tariff) tariff = { tariff: 'none' };
      if (status_result && tariff) return res.status(200).json(Object.assign(tariff, status_result));
    } catch (e) {
      return status_handler(res, 400, 'Get error', e);
    }
  }

  async appointments(req, res) {
    try {
      const id = req.clientInfo.Master.id;
      const slots = await Calendar_slot.findAll({
        where: { MasterId: id },
      });
      const appointments = [];
      if (slots.length == 0) return status_handler(res, 404, 'No slots');
      for (const slot of slots) {
        appointments.push(
          await Appointment.findOne({
            where: { CalendarSlotId: slot.id },
            raw: true,
          })
        );
      }

      if (appointments.length == 0) return status_handler(res, 404, 'No appointments');
      return res.status(200).json(appointments);
    } catch (e) {
      return status_handler(res, 400, 'Get error', e);
    }
  }

  // POST
  async create_service(req, res) {
    try {
      const id = req.clientInfo.Master.id;
      const { service_name } = req.body;
      const check = await checkLimit(id, 'service');
      if (!check) return status_handler(res, 403, 'Can not add more services or you tariff not active');

      const result = await Service.create({
        service_name: service_name,
        MasterId: id,
      });
      if (result) return status_handler(res, 201, 'Created successfully');
    } catch (e) {
      return status_handler(res, 400, 'Post error', e);
    }
  }

  async create_subservice(req, res) {
    try {
      const id = req.clientInfo.Master.id;
      const { subservice_name, price, id_service } = req.body;
      const check = await checkLimit(id, 'service');
      if (!check) return status_handler(res, 403, 'Can not add more services or you tariff not active');
      const result = await Subservice.create({
        subservice_name: subservice_name,
        ServiceId: id_service,
        subservice_price: price,
      });
      if (result) return status_handler(res, 201, 'Created successfully');
    } catch (e) {
      return status_handler(res, 400, 'Post error', e);
    }
  }

  async create_product(req, res) {
    try {
      const id = req.clientInfo.Master.id;
      const { product_name, description, price } = req.body;

      const check = await checkLimit(id, 'product');
      if (!check) return status_handler(res, 403, 'Can not add more products or you tariff not active');

      const result = await Product.create({
        product_name: product_name,
        MasterId: id,
        product_price: price,
        product_description: description,
      });
      if (result) return status_handler(res, 201, 'Created successfully');
    } catch (e) {
      return status_handler(res, 400, 'Post error', e);
    }
  }

  async create_slot(req, res) {
    try {
      const id = req.clientInfo.Master.id;
      let { date, time } = req.body;
      date = new Date(date).setHours(0, 0, 0, 0);
      const cur_date = new Date().setHours(0, 0, 0, 0);
      if (date < cur_date) return status_handler(res, 400, 'Invalid Data');
      if (date == cur_date && time <= new Date().toLocaleTimeString()) return status_handler(res, 400, 'Invalid Time');
      const result = await Calendar_slot.create({
        date: date,
        time: time,
        MasterId: id,
      });
      if (result) return status_handler(res, 201, 'Created successfully');
    } catch (e) {
      return status_handler(res, 400, 'Post error', e);
    }
  }

  // PUT
  async update_salon(req, res) {
    try {
      const body = req.body;
      const id = req.clientInfo.Master.id;

      let data = {
        salon_name: '',
        salon_logitude: '',
        salon_latitude: '',
        job_description: '',
      };
      data = checkData(body, data);
      if (Object.entries(data).length == 0) return status_handler(res, 400, 'There is no data');

      const result = await Master.update(data, { where: { id: id } });
      if (result == 0) return status_handler(res, 400, 'No rows affected');
      return status_handler(res, 201, `Updated successfully, rows affected: ${result[0]}`);
    } catch (e) {
      status_handler(res, 400, 'PUT error', e);
    }
  }

  async update_service(req, res) {
    try {
      const { service_name, id_service } = req.body;
      if (!service_name) return status_handler(res, 400, 'There is no data');
      const result = await Service.update(
        { service_name: service_name },
        {
          where: { id: id_service },
        }
      );
      if (result == 0) return status_handler(res, 400, 'No rows affected, data is invalid');
      return status_handler(res, 201, `Updated successfully, rows affected: ${result[0]}`);
    } catch (e) {
      status_handler(res, 400, 'PUT error', e);
    }
  }

  async update_subservice(req, res) {
    try {
      const body = req.body;
      const id_subservice = req.body.id_subservice;
      let data = {
        subservice_name: '',
        subservice_price: '',
      };
      data = checkData(body, data);
      if (Object.entries(data).length == 0) return status_handler(res, 400, 'There is no data');

      const result = await Subservice.update(data, {
        where: { id: id_subservice },
      });
      if (result == 0) return status_handler(res, 400, 'No rows affected, data is invalid');
      return status_handler(res, 201, `Updated successfully, rows affected: ${result[0]}`);
    } catch (e) {
      status_handler(res, 400, 'PUT error', e);
    }
  }

  async update_product(req, res) {
    try {
      const body = req.body;
      const id_product = req.body.id_product;
      let data = {
        product_name: '',
        product_price: '',
        product_description: '',
      };
      data = checkData(body, data);
      if (Object.entries(data).length == 0) return status_handler(res, 400, 'There is no data');

      const result = await Product.update(data, {
        where: { id: id_product },
      });
      if (result == 0) return status_handler(res, 400, 'No rows affected, data is invalid');
      return status_handler(res, 201, `Updated successfully, rows affected: ${result[0]}`);
    } catch (e) {
      status_handler(res, 400, 'PUT error', e);
    }
  }

  async update_slot(req, res) {
    try {
      const { status, id_slot } = req.body;
      if (!status) return status_handler(res, 400, 'There is no status');
      const result = await Calendar_slot.update(status, {
        where: { id: id_slot },
      });
      if (result == 0) return status_handler(res, 400, 'No rows affected, data is invalid');
      return status_handler(res, 201, `Updated successfully, rows affected: ${result[0]}`);
    } catch (e) {
      status_handler(res, 400, 'PUT error', e);
    }
  }

  async update_appointment(req, res) {
    try {
      const { status, id_appointment } = req.body;
      if (!status) return status_handler(res, 400, 'There is no status');
      const result = await Appointment.update(status, {
        where: { id: id_appointment },
      });
      // notificatiom for client
      if (result == 0) return status_handler(res, 400, 'No rows affected, data is invalid');
      return status_handler(res, 201, `Updated successfully, rows affected: ${result[0]}`);
    } catch (e) {
      status_handler(res, 400, 'PUT error', e);
    }
  }

  // DELETE
  async delete(req, res) {
    try {
      const id = req.clientInfo.Master.id;
      const result = await Master.destroy({ where: { id: id } });
      if (result) return status_handler(res, 200, 'Deleted successfully');
    } catch (e) {
      return status_handler(res, 400, 'Delete error', e);
    }
  }

  async delete_appointment(req, res) {
    try {
      const { id_appointment } = req.body;
      const appointment = await Appointment.findOne({
        where: { id: id_appointment },
        attributes: ['CalendarSlotId'],
        rawData: true,
      });
      const result = await Appointment.destroy({
        where: { id: id_appointment },
      });
      const slot = await Calendar_slot.update({ busy: false }, { where: { id: appointment.CalendarSlotId } });
      // notification for client
      if (result && slot) return status_handler(res, 200, 'Deleted successfully');
    } catch (e) {
      status_handler(res, 400, 'Delete error', e);
    }
  }

  async delete_product(req, res) {
    try {
      const { id_product } = req.body;
      const result = await Product.destroy({ where: { id: id_product } });
      if (result) return status_handler(res, 200, 'Deleted successfully');
    } catch (e) {
      status_handler(res, 400, 'Delete error', e);
    }
  }

  async delete_service(req, res) {
    try {
      const { id_service } = req.body;
      const result = await Service.destroy({ where: { id: id_service } });
      if (result) return status_handler(res, 200, 'Deleted successfully');
    } catch (e) {
      status_handler(res, 400, 'Delete error', e);
    }
  }

  async delete_subservice(req, res) {
    try {
      const { id_subservice } = req.body;
      const result = await Subservice.destroy({
        where: { id: id_subservice },
      });
      if (result) return status_handler(res, 200, 'Deleted successfully');
    } catch (e) {
      status_handler(res, 400, 'Delete error', e);
    }
  }

  async delete_slot(req, res) {
    try {
      const { id_slot } = req.body;
      const result = await Calendar_slot.destroy({
        where: { id: id_slot },
      });
      if (result) return status_handler(res, 200, 'Deleted successfully');
    } catch (e) {
      status_handler(res, 400, 'Delete error', e);
    }
  }
}

module.exports = new MasterController();
