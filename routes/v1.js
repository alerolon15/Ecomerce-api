const express = require('express');
const router = express.Router();
const multer = require('multer');
const CompanyController = require('../controllers/CompanyController');
const ProductController = require('../controllers/ProductController');
const imgUpload = require('../middleware/google-storage');
const m = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

const { checkCompany } = require('../middleware/companyMiddleware');

router.get('/', (req, res) => {
  res.json({ status: 'success', message: 'api v1 root' });
});

// CRUD companies
router.post('/companies', CompanyController.create);
router.get('/companies', CompanyController.getAll);
router.post('/image/companies', m.single('file'), imgUpload.uploadToGcs);

// url_key es el nombre de la empresa sin espacios y en miniscula
router.get('/companies/:url_key', CompanyController.get);
router.put('/companies/:url_key', CompanyController.update);
router.delete('/companies/:url_key', CompanyController.remove);
router.get(
  '/companies/:url_key/:page',
  CompanyController.getCompanyProductsByPage
);

// CRUD products

router.post('/products', ProductController.create);
router.get('/products', ProductController.getAll);

router.get('/products/:product_id', ProductController.get);
router.put('/products/:product_id', ProductController.update);
router.delete('/products/:product_id', ProductController.remove);
router.post('/image/products', m.single('file'), imgUpload.uploadToGcs);
module.exports = router;
