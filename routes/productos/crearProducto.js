const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Company = require('../../models/company')
const User = require('../../models/user');
const Producto = require('../../models/producto');

const rutaUpload = path.join(__dirname, '../../public/images/productos');

var nombres = [];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, rutaUpload)
  },
  filename: function (req, file, cb) {
    var nombrearchivo = req.body.codigo + '-' + Date.now() + path.extname(file.originalname);
    nombres.push(nombrearchivo);
    req.body.nombres = nombres;
    cb(null, nombrearchivo);
  }
})

var upload = multer({
  storage: storage
});


exports.crearGet = async (req, res) => {
  let urlkey = req.params.urlkey;
  Company.find({url_key:urlkey}, function(err, compania){
    if(req.session && req.session.user && req.session.user.esOwner){
      res.render('productos/crear', { usuario: req.session.user, compania:compania, bgClass:'bg-dark'});
    }else{
      res.redirect('/empresas');
    };
  });
};

exports.editarGet = function(req, res, next) {
  let urlkey = req.params.urlkey;
  let productoEditar = req.params.id;
  Company.find({url_key:urlkey}, function(err, compania){
    if(req.session && req.session.user && req.session.user.esOwner){
      Producto.findById(productoEditar, function(err, producto){
        if(err) {
          console.log(err);
        };
        res.render('productos/editar', { usuario: req.session.user, producto: producto, compania:compania, bgClass:'bg-dark'});
      });
    }else{
      res.redirect('/empresas');
    };
  });
};

exports.uploadFiles = upload.array('files', 8);

exports.crearPost = async (req, res) => {
  let urlkey = req.params.urlkey;

  Company.find({url_key:urlkey}, function(err, compania){

    let companiaUrlkey = compania[0].url_key;
    let companiaId = compania[0]._id;

    if(req.session && req.session.user && req.session.user.esOwner){
      /* validaciones del registro */
      req.check('codigo', 'Ingrese un codigo!').notEmpty();
      req.check('nombre', 'Ingrese un nombre!').notEmpty();
      req.check('descripcion', 'Ingrese una descripcion!').notEmpty()
      req.check('categoria', 'Ingrese una categoria!').notEmpty()
      req.check('stock', 'Ingrese stock!').notEmpty()

      var listaErrores = req.validationErrors();
      if (listaErrores) {
        let mensajes = [];
        listaErrores.forEach(function(error){
            mensajes.push(error.msg);
        });
        let options = {
          title: 'Aquosa',
          errores: mensajes,
          bgClass:'bg-dark',
          datos: req.body,
          compania:compania
        };
        return res.render('productos/crear',options);
      };

      let codigo = req.body.codigo;
      let nombre = req.body.nombre;
      let descripcion = req.body.descripcion;
      let precio = req.body.precio;
      let categoria = req.body.categoria.toUpperCase();
      let stock = req.body.stock;
      let estado = 'hacer req.body.estado';
      let imagenes = [];
      let proveedor = { razonSocial: req.body.razonSocial, email: req.body.email };
      let proveedores = [proveedor];
      let valorCompra = req.body.valorCompra;
      let ivaCompra = req.body.ivaCompra;
      let totalCompra = req.body.totalCompra;
      let valorVenta = req.body.valorVenta;
      let ivaVenta = req.body.ivaVenta;
      let totalVenta = req.body.totalVenta;
      let indicador = { porc_rent: 'hacer req.body.porc_rent' };
      let rentabilidad = [indicador];
      let observaciones = 'hacer req.body.observaciones';
      let urlcompanias = companiaUrlkey;
      let companias = [companiaId];

      if(req.files){
        req.body.nombres.forEach(function(files){
            imagenes.push(files);
        });
        nombres = [];
      };
      if (imagenes.length < 1) {
        imagenes.push("default.jpg");
      };

      let data = {
        codigo,
        nombre,
        descripcion,
        precio,
        categoria,
        stock,
        estado,
        imagenes,
        proveedores,
        valorCompra,
        ivaCompra,
        totalCompra,
        valorVenta,
        ivaVenta,
        totalVenta,
        rentabilidad,
        observaciones,
        urlcompanias,
        companias,
      };
      var producto = new Producto(data);
      producto.save(function(err){
        if (err) {
          res.render('productos/crear', {
            usuario: req.session.user,
            bgClass:'bg-dark',
            error: "<div class='alert alert-danger' role='alert'>No se pudo cargar el producto, falló la conexion a la base de datos.</div>",
            datos: req.body,
            compania:compania
          });
        }
        else {
          res.render('productos/crear', {
            usuario: req.session.user,
            bgClass:'bg-dark',
            error: "<div class='alert alert-success' role='alert'>Se ha creado correctamente el producto.</div>",
            compania:compania
          });
        };
      });
    }else{
      res.redirect('/empresas');
    };
  });
};
