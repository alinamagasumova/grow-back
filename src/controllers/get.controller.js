const { models: { Image }} = require('../../dbConfigs/db').sequelize;
function status_handler (res, status, msg='', err=false) {
    if (err) {
        console.log(err);
    }
    return res.status(status).json({msg: msg});
}

class GetController {
    
}

module.exports = new GetController();