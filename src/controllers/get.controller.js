const { models: { Photo, Master, Tariff, Feedback, Calendar_Slot }} = require('../../dbConfigs/db').sequelize;
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
            const result = await Master.findOne({ where: { id: id_master }, rawData: true });
            if (result) return res.status(200).json(result);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }

    async image (req, res) {
        try {
            const { id } = req.body;
            const result = await Photo.findOne({ where: { id: id }, rawData: true });
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

    // async rate (req, res) {
    //     try {
    //         const { id_master } = req.body;
    //         const result = await Feedback.findAll({ where: { MasterId: id_master }, attributes: ['rate'], rawData: true });
    //         console.log(result);
    //         if (result) return res.status(200).json(result);
    //     } catch (e) {
    //         status_handler(res, 400, 'GET error', e);
    //     }
    // }
}

module.exports = new GetController();