const { Op } = require('sequelize');
const {
  models: { Photo, Master, Tariff, Feedback, Calendar_slot, Client, Subservice, Product },
} = require('../../dbConfigs/db').sequelize;
const { status_handler, getSalonInfo } = require('../middleware/helpers');

class ApiController {
  async salons(req, res) {
    try {
      const salons = [];
      const masters = await Master.findAll({
        attributes: ['id', 'salon_name', 'salon_longitude', 'salon_latitude'],
        rawData: true,
      });

      for (const master of masters) {
        const salon = getSalonInfo(master);
        salons.push(salon);
      }
      if (masters.length == 0) return status_handler(res, 404, 'no salons');
      return res.status(200).json(salons);
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async salon(req, res) {
    try {
      const { id_master } = req.params;
      const result = await Master.findOne({
        where: { id: id_master },
        attributes: { exclude: ['TariffId', 'TariffStatusId', 'active_till', 'ClientId'] },
        rawData: true,
      });
      if (result) return res.status(200).json(getSalonInfo(result));
      return status_handler(res, 404, 'No such salon');
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async tariff_info(req, res) {
    try {
      const { id_master } = req.params;
      const result = await Master.findOne({
        where: { id: id_master },
        attributes: { attributes: ['id', 'TariffId', 'TariffStatusId', 'active_till'] },
        rawData: true,
      });
      if (result) return res.status(200).json(result);
      return status_handler(res, 404, 'No such master');
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async photo(req, res) {
    try {
      const { id } = req.params;
      const result = await Photo.findOne({
        where: { id: id },
        attributes: ['photo'],
        rawData: true,
      });
      if (result) return res.status(200).json(result);
      return status_handler(res, 404, 'No such photo');
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async subservice(req, res) {
    try {
      const { id } = req.params;
      const result = await Subservice.findOne({
        where: { id: id },
        rawData: true,
      });
      if (result) return res.status(200).json(result);
      return status_handler(res, 404, 'No such subservice');
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async product(req, res) {
    try {
      const { id } = req.params;
      const result = await Product.findOne({
        where: { id: id },
        rawData: true,
      });
      if (result) return res.status(200).json(result);
      return status_handler(res, 404, 'No such product');
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async client(req, res) {
    try {
      const { id } = req.params;
      const result = await Client.findOne({
        where: { id: id },
        attributes: { exclude: ['password'] },
        rawData: true,
      });
      if (result) return res.status(200).json(result);
      return status_handler(res, 404, 'No such client');
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async slot(req, res) {
    try {
      const { id } = req.params;
      const result = await Calendar_slot.findOne({
        where: { id: id },
        rawData: true,
      });
      if (result) return res.status(200).json(result);
      return status_handler(res, 404, 'No such slot');
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async tariffs(req, res) {
    try {
      const result = await Tariff.findAll({ rawData: true });
      if (result) return res.status(200).json(result);
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async rate(req, res) {
    try {
      const { id_master } = req.params;
      const result = await Feedback.findAll({
        where: { MasterId: id_master },
        attributes: ['rate'],
        rawData: true,
      });
      let avgRate = 0;
      if (result.length != 0) {
        result.forEach((el) => {
          avgRate += el.rate;
        });
        avgRate = Math.round((avgRate / result.length) * 10) / 10;
      }
      if (result) return res.status(200).json(avgRate);
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async feedback(req, res) {
    try {
      const { id_feedback } = req.params;
      const result = await Feedback.findOne({
        where: { id: id_feedback },
        rawData: true,
      });
      if (result) return res.status(200).json(result);
      return status_handler(res, 404, 'No such feedback');
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async feedbacks_from(req, res) {
    try {
      const { id_master, offset, limit } = req.body;
      const feedbacks = await Feedback.findAll({
        where: { MasterId: id_master },
        order: [['id', 'DESC']],
        offset: offset,
        limit: limit,
        rawData: true,
      });
      if (feedbacks) return res.status(200).json(feedbacks);
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async date_slots(req, res) {
    try {
      const { id_master, date } = req.body;
      // attributes: ['date', 'time', 'busy'],
      const result = await Calendar_slot.findAll({
        where: { MasterId: id_master, date: new Date(date) },
        rawData: true,
      });
      if (result) return res.status(200).json(result);
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async month_statuses(req, res) {
    try {
      const { id_master, year, month } = req.body;
      // prepare date (how many days in month)
      let day = 30;
      if ([0, 3, 5, 8, 10].includes(month)) day = 31;
      else if (month == 1) day = 28;
      const start_date = new Date(year, month - 1, 1);
      const end_date = new Date(year, month - 1, day);
      // find slots
      const dates = await Calendar_slot.findAll({
        where: {
          MasterId: id_master,
          date: { [Op.between]: [start_date, end_date] },
        },
        attributes: ['date'],
        order: [['date', 'ASC']],
        rawData: true,
      });
      // create array with existing date_slots
      const dates_with_slots = [];
      for (let d of dates) {
        d = new Date(d.dataValues.date).getDate();
        if (!dates_with_slots.includes(d)) dates_with_slots.push(d);
      }
      return res.status(200).json(dates_with_slots);
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }

  async salons_location(req, res) {
    try {
      const { left_top, right_bottom } = req.body;
      const latitude_LT = left_top[0];
      const longitude_LT = left_top[1];
      const latitude_RB = right_bottom[0];
      const longitude_RB = right_bottom[1];
      const result = await Master.findAll({
        where: {
          salon_latitude: {
            [Op.and]: {
              [Op.gte]: latitude_RB,
              [Op.lte]: latitude_LT,
            },
          },
          salon_longitude: {
            [Op.and]: {
              [Op.gte]: longitude_LT,
              [Op.lte]: longitude_RB,
            },
          },
        },
        attributes: ['id', 'salon_latitude', 'salon_longitude'],
        rawData: true,
      });
      if (result.length == 0) return status_handler(res, 404, 'no salons');
      if (result) return res.status(200).json(result);
    } catch (e) {
      status_handler(res, 400, 'GET error', e.message);
    }
  }
}

module.exports = new ApiController();
