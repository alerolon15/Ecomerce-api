'use strict';
const Company = require('../models/company');
const Product = require('../models/product');

// Esto lo tengo que refactorizar.
const create = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  //asigna el producto del body de la request
  let body = {};
  body = { ...req.body.data };

  //asigna el id de la compania del body de la request
  const company_id = req.body.company_id;

  let err;
  let company;

  //TODO: Esto es ineficiente podria haber menos pedidos a la base de datos

  //pausa la ejecucion de la funcion hasta que encuentre la empreasa
  [err, company] = await to(Company.findById(company_id));

  if (err) {
    return ReE(res, err, 400);
  }

  if (!company) {
    return ReE(res, 'no se encontro compania', 400);
  }

  //Si la encontro procede a crear y guardar el nuevo producto
  if (company) {
    let err;
    let product;
    [err, product] = await to(
      Product.create({ ...body, companias: [company._id] })
    );

    if (err) {
      return ReE(res, err, 400);
    }
    //Si guarda el produco agrega id al array de productos
    if (product) {
      let err;
      let company;

      [err, company] = await to(
        Company.findByIdAndUpdate(
          company_id,
          { $push: { productos: product } },
          { new: true, upsert: true }
        )
      );

      if (err) {
        return ReE(res, err, 400);
      }
      //si todo sale bien devuelve el nuevo producto
      if (company) {
        return ReS(res, product, 200);
      }
    }
  }
};

module.exports.create = create;

const getAll = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  let err;
  let products;

  // console.log(to);
  [err, products] = await to(Product.find({}));

  if (err) {
    return ReE(res, err, 500);
  }

  return ReS(res, products, 200);
};

module.exports.getAll = getAll;

const get = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const product_id = req.params.product_id;

  let [err, product] = await to(Product.findById(product_id));

  if (err) {
    return ReE(res, err, 400);
  }

  if (!product) {
    return ReE(res, `No se encontro producto con id ${product_id}`, 400);
  }
  return ReS(res, product, 200);
};

module.exports.get = get;

const update = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const product_id = req.params.product_id;
  let body = {};
  body = { ...req.body };

  let [err, product] = await to(
    Product.findByIdAndUpdate(product_id, body, { new: true })
  );

  if (err) {
    return ReE(res, err, 400);
  }

  if (!product) {
    return ReE(res, `No se encontro producto con id ${product_id}`, 400);
  }
  return ReS(res, product, 200);
};

module.exports.update = update;

const remove = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const product_id = req.params.product_id;

  let [err, product] = await to(Product.findByIdAndRemove(product_id));

  if (err) {
    return ReE(res, err, 400);
  }

  if (product) {
    product.companias.forEach(async company_id => {
      let [err, company] = await to(
        Company.findByIdAndUpdate(
          company_id,
          { $pull: { productos: product_id } },
          { new: true }
        )
      );
      if (err) {
        return ReE(res, err, 400);
      }
      if (company) {
        return ReS(
          res,
          { message: `El producto ${product._id} fue eliminada` },
          200
        );
      }
    });
  }
};

module.exports.remove = remove;
