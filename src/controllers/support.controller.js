const requests = require('../../dbConfigs/support_db').Support_request;
function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
};

class SupportController {
    async getRequests(req, res) {
        try {
            const result = await requests.findAll({rawData: true});
            if (result) return res.status(200).json(result);
        } catch (e) {
            status_handler(res, 400, 'GET error', e);
        }
    }
}

module.exports = new SupportController();