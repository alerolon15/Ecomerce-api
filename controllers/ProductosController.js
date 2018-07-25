const Company = require('../models/company');
const Producto = require('../models/producto');
const User = require('../models/user');
const { ObjectId } = require('mongoose').Types;

const get = async (req, res) => {
  let urlkey = req.params.urlkey;
  let productoId = req.params.id;
  Company.find({url_key:urlkey},function(err,compania){
    Producto.findById(productoId, function(err, producto){
        if(req.session && req.session.user){
          let inicialN = req.session.user.nombre.substring(0,1);
          let inicialA = req.session.user.apellido.substring(0,1);
          let iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
          req.session.user.iniciales = iniciales;

          let productoId = req.params.id;
            res.render('productos/info', { usuario: req.session.user, producto: producto, compania:compania });
        }else{
          res.render('productos/info', { producto: producto, compania:compania });
        }
    });
  });
};
module.exports.get = get;

const listaGet = async (req, res) => {
  let urlkey = req.params.urlkey;
  Company.find({url_key:urlkey}, function(err, compania){
    let companiaUrlkey = compania[0].url_key;
    Producto.find({urlcompanias:companiaUrlkey}, function(err, productos){
      if(req.session && req.session.user && req.session.user.esAdmin){
        var inicialN = req.session.user.nombre.substring(0,1);
        var inicialA = req.session.user.apellido.substring(0,1);
        var iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
        req.session.user.iniciales = iniciales;

        res.render('productos/lista', { usuario: req.session.user, productos: productos, compania: compania });
      }else{
        res.render('productos/lista', { productos: productos, compania: compania });
      }
    });
  });
};
module.exports.listaGet = listaGet;


const borrarProducto = async (req, res) => {
  let productoBorrar = req.params.id;
  Producto.findByIdAndRemove(productoBorrar, function(err, producto){
    if(err) {
      console.log(err);
    };
    if(req.session && req.session.user && req.session.user.esAdmin){
      let inicialN = req.session.user.nombre.substring(0,1);
      let inicialA = req.session.user.apellido.substring(0,1);
      let iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
      req.session.user.iniciales = iniciales;

      res.redirect('/empresas/' + req.params.urlkey + '/listaProducto');
    }else{
      res.redirect("/empresas")
    }
  });
};
module.exports.borrarProducto = borrarProducto;

const crearProducto = async (req, res) => {
  let urlkey = req.params.urlkey;
  Company.find({url_key:urlkey}, function(err, compania){
    console.log(req.params);
    if(req.session && req.session.user && req.session.user.esAdmin){
      let inicialN = req.session.user.nombre.substring(0,1);
      let inicialA = req.session.user.apellido.substring(0,1);
      let iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
      req.session.user.iniciales = iniciales;

      res.render('productos/crear', { usuario: req.session.user, compania:compania, bgClass:'bg-dark'});
    }else{
      res.redirect('/empresas');
    };
  });
};

module.exports.crearProducto = crearProducto;

const crearProductoPost = async (req, res) => {
  console.log(req);
  console.log(req.body);
  let urlkey = req.params.urlkey;

  Company.find({url_key:urlkey}, function(err, compania){

    let companiaUrlkey = compania[0].url_key;
    let companiaId = compania[0]._id;

    if(req.session && req.session.user && req.session.user.esAdmin){
      let inicialN = req.session.user.nombre.substring(0,1);
      let inicialA = req.session.user.apellido.substring(0,1);
      let iniciales = inicialN.toUpperCase() + inicialA.toUpperCase();
      req.session.user.iniciales = iniciales;

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
      console.log('PASO3 : ' + data);
      var producto = new Producto(data);
      producto.save(function(err){
        if (err) {
          console.log('ERROR');
          res.render('productos/crear', {
            usuario: req.session.user,
            bgClass:'bg-dark',
            error: "<div class='alert alert-danger' role='alert'>No se pudo cargar el producto, falló la conexion a la base de datos.</div>",
            datos: req.body,
            compania:compania
          });
        }
        else {
          console.log('OK');
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
module.exports.crearProductoPost = crearProductoPost;
