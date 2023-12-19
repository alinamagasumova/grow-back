const {
  models: { Master },
} = require('../../dbConfigs/db').sequelize;
function status_handler(res, status, msg = '', err = false) {
  return res.status(status).json({ msg: msg, err: err });
}

function checkData(body, data) {
  for (const item in body) {
    if (data[item] == '') data[item] = body[item];
    else console.log(item, 'is not updatable');
  }

  for (const [key, val] of Object.entries(data)) {
    if (val == '') delete data[key];
  }
  return data;
}

async function checkLimit(id, subj) {
  const this_master = await Master.findOne({ where: { id: id } });
  const tariff = await this_master.getTariff();
  if (this_master.TariffStatusId == 3) return false;
  let amount,
    limit = 0,
    service;
  switch (subj) {
    case 'service':
      amount = await this_master.countServices();
      for (service of await this_master.getServices()) {
        amount += await service.countSubservices();
      }
      limit = tariff.service_limit;
      break;
    case 'product':
      amount = await this_master.countProducts();
      limit = tariff.product_limit;
      break;
    case 'photo':
      amount = await this_master.countPhotos();
      limit = tariff.photo_limit;
      break;
  }

  const dops = await this_master.getDops();
  dops.forEach((dop) => {
    if (dop.dop_name == subj) {
      limit += dop.dop_amount;
    }
  });

  if (amount >= limit) return false;
  return true;
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

module.exports = { status_handler, checkData, checkLimit, getSalonInfo };
