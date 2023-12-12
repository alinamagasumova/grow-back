const { Op } = require('sequelize');
const {
  models: { Photo, Master, Tariff, Feedback, Calendar_slot },
} = require('../../dbConfigs/db').sequelize;

function status_handler(res, status, msg = '', err = false) {
  if (err) {
    console.log(err);
  }
  return res.status(status).json({ msg: msg });
}
async function getSalonInfo(master) {
  try {
    const services = await master.getServices({
      attributes: ['id', 'service_name'],
    });
    const services_subservices = [];
    if (services.length > 0) {
      for (const [idx, service] of services.entries()) {
        services_subservices.push(service.dataValues);
        services_subservices[idx].subservices = await service.getSubservices({
          attributes: ['id', 'subservice_name', 'subservice_price'],
          rawData: true,
        });
      }
    }
    const products = await master.getProducts({
      attributes: ['id', 'product_name', 'product_price', 'product_description'],
      rawData: true,
    });

    return {
      salon: master.dataValues,
      services: services_subservices,
      products: products,
    };
  } catch (e) {
    console.log(e);
  }
}

class ApiController {
  async salons(req, res) {
    try {
      const salons = [];
      const masters = await Master.findAll({
        attributes: ['id', 'salon_name', 'salon_longitude', 'salon_latitude'],
        rawData: true,
      });

      for (const master of masters) {
        const salon = await getSalonInfo(master);
        salons.push(salon);
      }

      return res.status(200).json(salons);
    } catch (e) {
      status_handler(res, 400, 'GET error', e);
    }
  }

  async salon(req, res) {
    try {
      const { id_master } = req.params;
      const master = await Master.findOne({
        where: { id: id_master },
        attributes: ['id', 'salon_name', 'salon_longitude', 'salon_latitude'],
        rawData: true,
      });
      if (master) return res.status(200).json(await getSalonInfo(master));
    } catch (e) {
      status_handler(res, 400, 'GET error', e);
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
    } catch (e) {
      status_handler(res, 400, 'GET error', e);
    }
  }

  async tariffs(req, res) {
    try {
      const result = await Tariff.findAll({ rawData: true });
      if (result) return res.status(200).json(result);
    } catch (e) {
      status_handler(res, 400, 'GET error', e);
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
      status_handler(res, 400, 'GET error', e);
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
    } catch (e) {
      status_handler(res, 400, 'GET error', e);
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
      status_handler(res, 400, 'GET error', e);
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
      status_handler(res, 400, 'GET error', e);
    }
  }

  async month_statuses(req, res) {
    try {
      const { id_master, year, month } = req.body;
      // prepare date (how may days in month)
      let day = 30;
      if ([1, 3, 5, 8, 10].includes(month)) day = 31;
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
      status_handler(res, 400, 'GET error', e);
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
      status_handler(res, 400, 'GET error', e);
    }
  }
}

module.exports = new ApiController();
