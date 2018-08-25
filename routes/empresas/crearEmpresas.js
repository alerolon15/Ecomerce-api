const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Company = require('../../models/company')
const User = require('../../models/user');
const Producto = require('../../models/producto');
const rutaUpload = path.join(__dirname, '../../public/images/empresas');

var nombres = [];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, rutaUpload)
  },
  filename: function (req, file, cb) {
    var nombrearchivo = NSTR(req.body.nombre_fantasia) + '-' + Date.now() + path.extname(file.originalname);
    nombres.push(nombrearchivo);
    req.body.nombres = nombres;
    cb(null, nombrearchivo);
  }
})

var upload = multer({
  storage: storage
});

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

exports.crearGet = async (req, res) => {
  if(req.session && req.session.user && req.session.user.esOwner){
    res.render('empresas/crear', { usuario: req.session.user, bgClass:'bg-dark'});
  }else{
    res.redirect('/empresas');
  };
};


exports.uploadFiles = upload.array('files', 8);

exports.crearPost = async (req, res) => {
  if(req.session && req.session.user && req.session.user.esOwner){
    /* validaciones del registro */
    req.check('nombre_fantasia', 'Ingrese un nombre!').notEmpty();
    req.check('nombres', 'Ingrese una imagen principal!').notEmpty();
    req.check('email', 'Ingrese un email!').notEmpty();
    req.check('direccion', 'Ingrese una dirección!').notEmpty();
    var listaErrores = req.validationErrors();
    if (listaErrores) {
      var mensajes = [];
      listaErrores.forEach(function(error){
          mensajes.push(error.msg);
      });

      return res.render('empresas/crear', {
        usuario: req.session.user,
        bgClass:'bg-dark',
        errores: mensajes,
        datos: req.body
      });
    };
    let data =
    {
        "nombre_fantasia": req.body.nombre_fantasia,
        "quienes_somos": req.body.quienes_somos,
        "que_hacemos": req.body.que_hacemos,
        "direccion": req.body.direccion,
        "email": req.body.email,
        "owner": [req.session.user._id],
        "active": true,
        "imagen_principal": req.body.nombres[0],
        "catalogo_imagenes": [],
        "descripcion_producto_servicio": [
            {
                "producto_servicio_1": "",
                "descripcion_1": req.body.descripcion,
                "producto_servicio_2": "",
                "descripcion_2": "",
                "producto_servicio_3": "",
                "descripcion_3": "",

            }
        ],
        "caracteristicas_negocio": [
            {
                "caracteristica_1": "",
                "caracteristica_2": "",
                "caracteristica_3": "",

            }
        ],
        "redes_sociales": [
            {
                "facebook": req.body.facebook,
                "youtube": req.body.instagram,

            }
        ],
        "telefono": [
            {
                "fijo": req.body.telefonofijo,
                "movil": req.body.telefonomovil,
            }
        ]
    };

    if(req.files){
      req.body.nombres.forEach(function(items,index){
        if (index != 0) {
          data.catalogo_imagenes.push(items);
        };
      });
      nombres = [];
    };

    var empresa = new Company(data);
    empresa.save(function(err){
      if (err) {
        console.log('error al guardar empresa');
        console.log(err);
        console.log('----------');
        res.render('empresas/crear', {
          usuario: req.session.user,
          bgClass:'bg-dark',
          error: "<div class='alert alert-danger' role='alert'>No se pudo crear la empresa, falló la conexion a la base de datos.</div>",
          datos: req.body
        });
      }
      else {
        res.render('empresas/crear', {
          usuario: req.session.user,
          bgClass:'bg-dark',
          error: "<div class='alert alert-success' role='alert'>Se ha creado correctamente la empresa.</div>",
        });
      };
    });
  }else{
    res.redirect('/empresas');
  };
};
