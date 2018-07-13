const Company = require('../models/company');
const Product = require('../models/product');
const checkRequiredFields = company => {};
const checkCompany = async (req, res, next) => {
  const reqCompany = req.body;

  if (reqCompany.nombre_fantasia) {
    try {
      const companyName = await Company.findOne({
        nombre_fantasia: reqCompany.nombre_fantasia
      });

      if (companyName) {
        ReE(res, { message: 'El usuario ya existe' }, 400);
      }
      const companyEmail = await Company.findOne({ email: reqCompany.email });
      if (companyEmail) {
        ReE(res, { messege: 'El email ya esta registrado' }, 400);
      }
    } catch (error) {
      console.log(error);
      ReE(res, { message: 'Database Error', error }, 400);
    }
  }
};

module.exports.checkCompany = checkCompany;
