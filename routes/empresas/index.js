const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Producto = require('../../models/producto');
const Company = require('../../models/company');
const path = require('path');
const multer = require('multer');
const EmpresasCrear = require('./crearEmpresas');
const EmpresasLista = require('./listaEmpresas');


router.get('/crearEmpresas', EmpresasCrear.crearGet);
router.post('/crearEmpresas', EmpresasCrear.uploadFiles, EmpresasCrear.crearPost);

router.get('/listaEmpresas', EmpresasLista.listaGet);
router.get('/listaEmpresas/borrar/:id', EmpresasLista.borrar);
//router.post('/listaEmpresas', EmpresasLista.crearPost);

module.exports = router;
