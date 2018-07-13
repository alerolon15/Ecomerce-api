const Company = require('../models/company');
const Product = require('../models/product');
const { ObjectId } = require('mongoose').Types;

//TODO: arreglar todos los codigos de error
const create = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const body = req.body;
  try {
    let company = await Company.create(body);
    return ReS(res, company, 200);
  } catch (error) {
    return ReE(res, error, 400);
  }
};

module.exports.create = create;

const getAll = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    let companies = await Company.find({});
    return ReS(res, companies);
  } catch (error) {
    return ReE(res, err, 400);
  }
};

module.exports.getAll = getAll;

const get = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const url_key = req.params.url_key;
  try {
    let company = await Company.findOne({ url_key }).populate('productos');

    //TODO: Esto solo es en desarollo encontrar otra solucion.
    if (!company) {
      return ReE(res, 'No se encontro compania', 400);
    }
    //Populate manual para poder agregar paginacion

    return ReS(res, company, 200);
  } catch (error) {
    return ReE(res, error, 400);
  }
};

module.exports.get = get;

const update = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const url_key = req.params.url_key;
  const body = { ...req.body };

  body.nombre_fantasia && (body.url_key = NSTR(body.nombre_fantasia));

  try {
    let company = await Company.findOneAndUpdate(
      { url_key },
      { ...body },
      { new: true }
    );
    if (!company) {
      ReE(res, 'no se encontro empresa', 400);
    }
    return ReS(res, company, 200);
  } catch (error) {
    return ReE(res, error, 400);
  }
};

module.exports.update = update;

//TODO: Cuando se elimina una compania se debe pullear de cada array de companias de los productos
const remove = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const url_key = req.params.url_key;
  try {
    let company = await Company.findOneAndRemove({ url_key });
    if (!company) {
      return ReE(res, { messsage: 'no existe compania' }, 400);
    }

    const message = `La compania ${company.nombre_fantasia} fue eliminada`;
    return ReS(res, { message }, 200);
  } catch (error) {
    return ReE(res, err, 400);
  }
};

module.exports.remove = remove;

const postImage = async (req, res) => {
  console.log(req.error);
  if (req.file && req.file.cloudStoragePublicUrl) {
    req.body.imageUrl = req.file.cloudStoragePublicUrl;
  }
  res.send(req.body);
};
module.exports.postImage = postImage;

const getCompanyProductsByPage = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const url_key = req.params.url_key;
  const perPage = 12;
  var page = req.params.page || 1;
  try {
    let company = await Company.findOne({ url_key });
    if (!company) {
      ReS(res, 'La Empresa no existe', 200);
    }
    Product.find({
      _id: { $in: company.productos.map(id => ObjectId(id)) }
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, productos) => {
        ReS(res, { page, productos }, 200);
      });
  } catch (error) {
    return ReE(res, error, 400);
  }
};
module.exports.getCompanyProductsByPage = getCompanyProductsByPage;
