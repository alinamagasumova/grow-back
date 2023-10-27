const { Op } = require('sequelize');
const { models: { Photo, Master, Tariff, Feedback, Calendar_slot }} = require('../../dbConfigs/db').sequelize;
function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
}

class GetController {
    async salon (req, res) {
        try {
            const { id_master } = req.body;
            const master = await Master.findOne({ where: { id: id_master }, attributes: ['id', 'salon_name', 'salon_longitude', 'salon_latitude'], rawData: true });
            const services = await master.getServices({ attributes: ['id', 'service_name'] });
            let services_subservices = [];
            if (services.length > 0) {
                for (let [idx, service] of services.entries()) {
                    services_subservices.push(service.dataValues);
                    services_subservices[idx].subservices = await service.getSubservices({ attributes: ['id', 'subservice_name', 'subservice_price'], rawData: true });
                }
            }
            const products = await master.getProducts({ attributes: ['id', 'product_name', 'product_price', 'product_description'], rawData: true });
            const salon_info = {
                salon: master,
                services: services_subservices,
                products: products
            }
            if (master && services && products) return res.status(200).json(salon_info);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async photo (req, res) {
        try {
            const { id } = req.body;
            const result = await Photo.findOne({ where: { id: id }, attributes: ['photo'], rawData: true });
            if (result) return res.status(200).json(result);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async tariffs (req, res) {
        try {
            const result = await Tariff.findAll({ rawData: true });
            if (result) return res.status(200).json(result);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async rate (req, res) {
        try {
            const { id_master } = req.body;
            const result = await Feedback.findAll({ where: { MasterId: id_master }, attributes: ['rate'], rawData: true });
            let avgRate = 0;
            if (result.length != 0) {
                result.forEach(el => { avgRate += el.rate });
                avgRate = Math.round(avgRate / result.length * 10) / 10;
            }
            if (result) return res.status(200).json(avgRate);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async feedback (req, res) {
        try {
            const { id_feedback } = req.body;
            const result = await Feedback.findOne({ where: { id: id_feedback }, rawData: true });
            if (result) return res.status(200).json(result);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async feedbacks_from (req, res) {
        try {
            const { id_master, offset, limit } = req.body;
            const feedbacks = await Feedback.findAll({ where: { MasterId: id_master }, order: [['id', 'DESC']], offset: offset, limit: limit, rawData: true });
            if (feedbacks) return res.status(200).json(feedbacks);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }
    
    async date_slots (req, res) {
        try {
            const { id_master, date } = req.body;
            // attributes: ['date', 'time', 'busy'],
            const result = await Calendar_slot.findAll({ where: { MasterId: id_master, date: new Date(date) }, rawData: true });
            if (result) return res.status(200).json(result);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async month_statuses (req, res) {
        try {
            const { id_master, year, month } = req.body;
            // prepare date
            let day = 30;
            if ([1,3,5,8,10].includes(month)) day = 31;
            else if (month == 1) day = 28;
            console.log([1,3,5,8,10].includes(month));
            const start_date = new Date(year, month-1, 1);
            const end_date = new Date(year, month-1, day);
            // find slots
            let dates_with_slots = [];
            const dates = await Calendar_slot.findAll({ where: { MasterId: id_master, date: { [Op.between]: [start_date, end_date] } }, attributes: ['date'], order: [['date', 'ASC']], rawData: true });
            for (let d of dates) {
                d = new Date(d.dataValues.date).getDate();
                if (!dates_with_slots.includes(d)) dates_with_slots.push(d);
            }
            if (dates) return res.status(200).json(dates_with_slots);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    // async masters (req, res) {
    //     try {
    //         const { left_top, right_bottom } = req.body;
    //         const result = await Master.findAll({ where: { id: id }, attributes: ['id'], rawData: true });
    //         if (result) return res.status(200).json(result);
    //     } catch (e) {
    //         status_handler(res, 400, 'GET error', e);
    //     }
    // }
}

module.exports = new GetController();