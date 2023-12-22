const {
  models: { Master, Photo },
} = require('../../dbConfigs/db').sequelize;
const fs = require('fs');

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

async function checkLimit(id, subj, cond = false) {
  const master = await Master.findOne({ where: { id: id } });
  const tariff = await master.getTariff();
  if (!tariff || master.TariffStatusId == 3) return false;
  let amount,
    limit = 0;
  switch (subj) {
    case 'service':
      amount = await master.countServices();
      for (const service of await master.getServices()) {
        amount += await service.countSubservices();
      }
      limit = tariff.service_limit;
      break;
    case 'product':
      amount = await master.countProducts();
      limit = tariff.product_limit;
      break;
    case 'photo':
      if (await master.getPhoto()) amount = 1;
      for (const product of await master.getProducts()) {
        if (await product.getPhoto()) amount += 1;
      }
      amount += await master.countPhotos();
      if (cond) amount -= 1;
      limit = tariff.photo_limit;
      break;
  }

  const dops = await master.getDops();
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
      attributes: { exclude: ['MasterId'] },
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

async function deleteFile(res, path, id = null) {
  fs.unlink(path, (e) => {
    if (e) {
      status_handler(res, 500, 'POST error', e.message);
      return;
    }
    console.log('File deleted');
  });
  if (id) await Photo.destroy({ where: { id: id } });
}

async function checkMasterPhotoDelete(req, res) {
  const master = await Master.findOne({ where: { id: req.clientInfo.Master.id } });
  if (!master) return;

  if (master.PhotoId) {
    const master_photo = await master.getPhoto();
    let master_path = master_photo.location.split('/');
    master_path = master_path[master_path.length - 1];
    deleteFile(res, master_path, master_photo.id);
  }

  const products = await master.getProducts();

  if (products.length > 0) {
    for (const product of products) {
      if (product.PhotoId) {
        const product_photo = await Photo.findOne({ where: { id: product.PhotoId } });
        let product_path = product_photo.location.split('/');
        product_path = product_path[product_path.length - 1];
        deleteFile(res, product_path, product_photo.id);
      }
    }
  }
}

module.exports = { status_handler, checkData, checkLimit, getSalonInfo, deleteFile, checkMasterPhotoDelete };
